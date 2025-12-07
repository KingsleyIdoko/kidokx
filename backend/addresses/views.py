from django.shortcuts import render
import json
from .serializers import AddressSerializers
from rest_framework import status
from rest_framework.response import Response
from inventories.models import Device
from addresses.scripts.get_device_addresses import device_addresses
from addresses.models import Address, AddressBook
from addresses.scripts.compare_data import data_comparison
from rest_framework.generics import ListAPIView,CreateAPIView,UpdateAPIView,DestroyAPIView
from django.forms.models import model_to_dict


class AddressListAPIView(ListAPIView):
    serializer_class = AddressSerializers
    queryset = Address.objects.none()

    def get_device(self):
        device_name = self.request.query_params.get('device')
        if not device_name:
            return None, Response(
                {"detail": "Device is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            device = Device.objects.get(device_name=device_name)
        except Device.DoesNotExist:
            return None, Response(
                {"detail": "Device not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        return device, None

    def get_queryset(self):
        device_name = self.request.query_params.get('device')
        if not device_name:
            return Address.objects.none()
        try:
            device = Device.objects.get(device_name=device_name)
        except Device.DoesNotExist:
            return Address.objects.none()

        return Address.objects.filter(device=device)

    def list(self, request, *args, **kwargs):
        # Validate & get device
        device, response_error = self.get_device()
        if response_error:
            return response_error

        # Try to get live data from NETCONF
        try:
            raw_device_data = device_addresses(
                username=device.username,
                password=device.password,
                host=device.ip_address,
            )
        except Exception as exc:
            # fallback → use DB
            queryset = self.get_queryset()
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)

        # 3. Sync NETCONF results → DB
        for item in raw_device_data:
            device_data = {
                "name": item.get("name"),
                "ip_prefix": item.get("ip_prefix"),
                "description": item.get("description"),
                "device": device.device_name                # FK instance (correct)
            }
            address_book_data = {
                "name": item.get('address_book'),
                "adresses": item.get('addresses'),
                "securityzone": item.get('zone')
                }
            # Does this Address record already exist?
            db_instance = Address.objects.filter(
                name=device_data["name"],
                device__device_name=device_data["device"],
            ).first()
            # -----------------------------
            # CREATE NEW ADDRESS
            # -----------------------------
            if db_instance is None:
                serializer = self.get_serializer(data=device_data)
                serializer.is_valid(raise_exception=True)
                serializer.save()
                continue

            # -----------------------------
            # UPDATE EXISTING ADDRESS (partial)
            # -----------------------------
            # Only compare fields we care about
            db_data = model_to_dict(
                db_instance,
                fields=["name", "ip_prefix", "description"]
            )

            # Compare: (old, new)
            data_diff = data_comparison(db_data, device_data)

            if data_diff:
                serializer = self.get_serializer(
                    db_instance,
                    data=data_diff,
                    partial=True
                )
                serializer.is_valid(raise_exception=True)
                serializer.save()

        # Return DB data
        queryset = self.get_queryset()
        response_serializer = self.get_serializer(queryset, many=True)
        return Response(response_serializer.data)

address_list_view = AddressListAPIView.as_view()


class AddressCreateAPIView(CreateAPIView):
    serializer_class = AddressSerializers
    queryset = Address.objects.all()

address_create_view = AddressCreateAPIView.as_view()

class AddressUpdateAPIView(UpdateAPIView):
    pass

class AddressDestroyAPIView(DestroyAPIView):
    pass

from django.shortcuts import render
import json
from .serializers import AddressBookSerializer
from rest_framework import status
from rest_framework.response import Response
from inventories.models import Device
from addresses.scripts.get_addressbook import get_address_book_config
from addresses.models import Address, AddressBook
from addresses.scripts.compare_data import missing_from_db
from rest_framework.generics import ListAPIView,CreateAPIView,UpdateAPIView,DestroyAPIView
from django.forms.models import model_to_dict
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework import status

class AddressListAPIView(ListAPIView):
    serializer_class = AddressBookSerializer
    queryset = AddressBook.objects.none()

    def get_device(self):
        device_name = self.request.query_params.get("device")
        if not device_name:
            return None, Response(
                {"detail": "Device is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            device_obj = Device.objects.get(device_name=device_name)
        except Device.DoesNotExist:
            return None, Response(
                {"detail": "Device not found"},
                status=status.HTTP_404_NOT_FOUND,
            )
        return device_obj, None

    def get_queryset(self):
        device_obj, response_error = self.get_device()
        if response_error:
            return AddressBook.objects.none()
        return AddressBook.objects.filter(device=device_obj)

    def list(self, request, *args, **kwargs):
        device, response_error = self.get_device()
        if response_error:
            return response_error
        try:
            raw_data = get_address_book_config(
                host=device.ip_address,
                username=device.username,
                password=device.password,
            )
            print(raw_data)
        except Exception as exc:
            # Option B: fallback to DB
            qs = self.get_queryset()
            serialized_data = self.get_serializer(qs, many=True).data
            return Response(
                {
                    "detail": "Failed to fetch live address-book; returning cached DB data.",
                    "error": str(exc),
                    "results": serialized_data,
                },
                status=status.HTTP_200_OK,
            )
        qs = self.get_queryset()
        existing = self.get_serializer(qs, many=True).data  # list
        print(raw_data)
        if existing:
            missing_data = missing_from_db(raw_data, existing)  # list
            print(missing_data)
            if missing_data:
                serializer = self.get_serializer(data=missing_data, many=True)
                serializer.is_valid(raise_exception=True)
                serializer.save()
        else:
            serializer = self.get_serializer(data=raw_data, many=True, context={"device": device})
            serializer.is_valid(raise_exception=True)
            serializer.save()
        qs = self.get_queryset()
        return Response(self.get_serializer(qs, many=True).data)

addressbook_view = AddressListAPIView.as_view()



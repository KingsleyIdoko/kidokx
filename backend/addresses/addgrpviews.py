from django.shortcuts import render
import json
from .serializers import AddressBookserializers
from rest_framework import status
from rest_framework.response import Response
from inventories.models import Device
from addresses.scripts.get_addressbook import get_address_book_config
from addresses.models import Address, AddressBook
from addresses.scripts.compare_data import data_comparison
from rest_framework.generics import ListAPIView,CreateAPIView,UpdateAPIView,DestroyAPIView
from django.forms.models import model_to_dict


class AddressListAPIView(ListAPIView):
    serializer_class = AddressBookserializers
    queryset = AddressBook.objects.all()

    def get_device(self):
        device_name = self.request.query_params.get('device')
        if  not device_name:
            return None, Response({"Detail" : "Device is required"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            Device.objects.get(device_name=device_name)
        except Device.DoesNotExist:
            return None, Response({"Detail" : "Device not found"},status=status.HTTP_404_NOT_FOUND)
        return Device, None


    def get_queryset(self):
        device = self.request.query_params.get('device')
        if not device:
            return Device.objects.none()
        device_obj = Device.objects.get(device_name=device)
        if device_obj:
            try:
                qs = AddressBook.objects.filter(device=device_obj)
            except Device.DoesNotExist:
                return Device.objects.none()
        return qs

    def list(self, request, *args, **kwargs):
        device, response_error = self.get_device
        try:
            raw_data = get_address_book_config(
                host=device.ip_address,
                username=device.username,
                password=device.password
            )
        except Exception as exc:
            serialized_data =  AddressBookserializers(self.get_queryset, many=True).data
            return Response(serialized_data)

addressbook_view = AddressListAPIView.as_view()


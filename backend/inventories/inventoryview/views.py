from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.generics import ListAPIView, CreateAPIView, DestroyAPIView, UpdateAPIView, RetrieveAPIView
from ..models import Device
from rest_framework import status
from ..serializers import InventoriesSerializer
from threading import Thread
from django.utils import timezone
from inventories.inventoryview.utils import update_device_status
from inventories.inventoryview.tasks import check_device


class DeviceListView(ListAPIView):
    queryset = Device.objects.all()
    serializer_class = InventoriesSerializer

device_list_view = DeviceListView.as_view()

class DeviceCreateView(CreateAPIView):
    queryset = Device.objects.all()
    serializer_class = InventoriesSerializer

device_create_view = DeviceCreateView.as_view()

class DeviceDetailView(RetrieveAPIView):
    queryset = Device.objects.all()
    serializer_class = InventoriesSerializer
    lookup_field = 'pk'

device_detail_view = DeviceDetailView.as_view()

class DeviceUpdateView(UpdateAPIView):  
    queryset = Device.objects.all()
    serializer_class = InventoriesSerializer
    lookup_field = 'pk'
device_update_view = DeviceUpdateView.as_view()

class DeviceDestroyView(DestroyAPIView):
    queryset = Device.objects.all()
    serializer_class = InventoriesSerializer
    lookup_field = 'pk'
    
device_delete_view = DeviceDestroyView.as_view()


class DeviceNamesView(APIView):
    def get(self, request):
        devicenames = Device.objects.values_list('device_name', flat=True)
        return Response(devicenames)  
device_names_view = DeviceNamesView.as_view()


class MonitorDevices(APIView):
 def get(self,request):
  now=timezone.now();
  valid_statuses=['up','down','unknown'];
  device_list=[]
  for device in Device.objects.all():
   if not device.last_checked or (now-device.last_checked).total_seconds()>=device.keepalive:check_device.delay(device.id)
   if device.status in valid_statuses:device_list.append({'device_name':device.device_name,'status':device.status,'last_checked':device.last_checked})
  return Response(device_list)


device_names_view = MonitorDevices.as_view()



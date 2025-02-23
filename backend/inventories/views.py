from django.shortcuts import render
from rest_framework.generics import ListAPIView, CreateAPIView, DestroyAPIView, UpdateAPIView, RetrieveAPIView
from .models import Device
from .serializers import InventoriesSerializer


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
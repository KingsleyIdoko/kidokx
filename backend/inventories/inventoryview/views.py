from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.generics import ListAPIView, CreateAPIView, DestroyAPIView, UpdateAPIView, RetrieveAPIView
from ..models import Device
from ..serializers import InventoriesSerializer


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
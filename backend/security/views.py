from django.shortcuts import render
from rest_framework.generics import ListAPIView, CreateAPIView, DestroyAPIView, UpdateAPIView, RetrieveAPIView
from .serializers import SecurityZoneSerializer
from .models import SecurityZone
from inventories.models import Device
from rest_framework.response import Response
from rest_framework import status
from security.scripts.securityzone.get_securityzones import get_securityzones
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework import status


class SecurityZoneListAPIView(ListAPIView):
    serializer_class = SecurityZoneSerializer
    queryset = SecurityZone.objects.none()  # default so DRF is happy

    def get_device(self):
        device_name = self.request.query_params.get('device')
        if not device_name:
            return None, Response(
                {'error': 'Device parameter required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            device = Device.objects.get(device_name=device_name)
        except Device.DoesNotExist:
            return None, Response(
                {'error': 'Device not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        return device, None

    def get_queryset(self):
        device_name = self.request.query_params.get('device')
        if not device_name:
            return SecurityZone.objects.none()

        try:
            device = Device.objects.get(device_name=device_name)
        except Device.DoesNotExist:
            return SecurityZone.objects.none()

        return SecurityZone.objects.filter(device=device)

    def list(self, request, *args, **kwargs):
        """
        1. Validate device
        2. Try to poll live zones from the firewall/device
        3. Save/update them in DB
        4. Return zones for just that device
        """
        device, error_response = self.get_device()
        if error_response:
            return error_response

        # Try to pull fresh live data from the device
        try:
            raw_device_data = get_securityzones(
                username=device.username,
                password=device.password,
                host=device.ip_address,
            )
        except Exception:
            # Could not poll live device -> just return DB data
            queryset = self.get_queryset()
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)
        if isinstance(raw_device_data, list):
            payload = [{**zone, 'device': device.device_name} for zone in raw_device_data]
            serializer = self.serializer_class(data=payload, many=True)
        else:
            payload = {**raw_device_data, 'device': device.device_name}
            serializer = self.serializer_class(data=payload)
        if serializer.is_valid():
            serializer.save()
        else:
            pass
        queryset = self.get_queryset()
        response_serializer = self.get_serializer(queryset, many=True)
        return Response(response_serializer.data)
securityzone_list_view = SecurityZoneListAPIView.as_view()

class SecurityZoneUpdateAPIView(CreateAPIView):
  pass

class SecurityZoneUpdateAPIView(UpdateAPIView):
  pass

class SecurityZoneDeleteAPIView(RetrieveAPIView):
  pass


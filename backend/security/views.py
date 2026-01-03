from django.shortcuts import render
from rest_framework.generics import ListAPIView, CreateAPIView, DestroyAPIView, UpdateAPIView, RetrieveAPIView
from .serializers import SecurityZoneSerializer
from .models import SecurityZone
from inventories.models import Device
from rest_framework.response import Response
from rest_framework import status
from security.scripts.securityzone.get_securityzones import get_securityzones
from security.scripts.securityzone.compareconfig import compare_device_and_backend_data
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction
from inventories.models import Device
from security.models import SecurityZone
from .serializers import SecurityZoneSerializer
from .scripts.securityzone.compareconfig import compare_device_and_backend_data
from .scripts.securityzone.get_securityzones import get_securityzones


class SecurityZoneListAPIView(ListAPIView):
    serializer_class = SecurityZoneSerializer

    # DRF requires a default queryset
    queryset = SecurityZone.objects.none()

    # -------------------------------
    # ✅  Validate device in request
    # -------------------------------
    def get_device(self):
        device_name = self.request.query_params.get("device")

        if not device_name:
            return None, Response(
                {"error": "Device parameter required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            device = Device.objects.get(device_name=device_name)
        except Device.DoesNotExist:
            return None, Response(
                {"error": "Device not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        return device, None

    # -------------------------------
    # ✅  Filter zones for this device
    # -------------------------------
    def get_queryset(self):
        device_name = self.request.query_params.get("device")
        if not device_name:
            return SecurityZone.objects.none()

        try:
            device = Device.objects.get(device_name=device_name)
        except Device.DoesNotExist:
            return SecurityZone.objects.none()

        return SecurityZone.objects.filter(device=device)

    # -------------------------------
    # ✅  Main List + Sync Logic
    # -------------------------------
    def list(self, request, *args, **kwargs):
        device, error_response = self.get_device()
        if error_response:
            return error_response

        # --------------------------------
        # ✅ 1. Try to fetch live firewall data
        # --------------------------------
        try:
            raw_device_data = get_securityzones(
                username=device.username,
                password=device.password,
                host=device.ip_address,
            )
        except Exception:
            # device unreachable → return DB data only
            queryset = self.get_queryset()
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)

        # --------------------------------
        # ✅ 2. Normalize live device data
        # --------------------------------
        device_data = [
            {**zone, "device": device.device_name}
            for zone in raw_device_data if raw_device_data
        ]

        # --------------------------------
        # ✅ 3. Load backend zones
        # --------------------------------
        backend_qs = SecurityZone.objects.filter(device=device)
        backend_data = SecurityZoneSerializer(backend_qs, many=True).data

        if raw_device_data:
            # --------------------------------
            # ✅ 4. Compare configurations
            # --------------------------------
            config_changes = compare_device_and_backend_data(device_data, backend_data)
            # --------------------------------
            # ✅ 5. Apply changes (atomic)
            # --------------------------------
            with transaction.atomic():
                for change in config_changes:

                    # -------------------------
                    # ✅ CREATE MISSING ZONE
                    # -------------------------
                    if change["action"] == "create":
                        payload = change["payload"]
                        serializer = SecurityZoneSerializer(data=payload)
                        serializer.is_valid(raise_exception=True)
                        serializer.save()

                    # -------------------------
                    # ✅ UPDATE EXISTING ZONE
                    # -------------------------
                    elif change["action"] == "update":
                        zone_id = change["id"]
                        diff_data = change["data"]

                        try:
                            instance = SecurityZone.objects.get(id=zone_id)
                        except SecurityZone.DoesNotExist:
                            continue

                        serializer = SecurityZoneSerializer(
                            instance,
                            data=diff_data,
                            partial=True
                        )
                        serializer.is_valid(raise_exception=True)
                        serializer.save()

        # --------------------------------
        # ✅ 6. Return updated database
        # --------------------------------
        queryset = self.get_queryset()
        response_serializer = self.get_serializer(queryset, many=True)

        return Response(response_serializer.data)

securityzone_list_view = SecurityZoneListAPIView.as_view()

class SecurityZoneCreateAPIView(CreateAPIView):
  serializer_class = SecurityZoneSerializer
  queryset = SecurityZone.objects.all()

securityzone_create_view = SecurityZoneCreateAPIView.as_view()


class SecurityZoneUpdateAPIView(UpdateAPIView):
  pass

class SecurityZoneDeleteAPIView(RetrieveAPIView):
  pass


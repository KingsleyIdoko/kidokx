from django.shortcuts import render
from rest_framework.generics import ListAPIView, CreateAPIView, DestroyAPIView, UpdateAPIView, RetrieveAPIView
from ipsecs.models import IpsecVpn
from inventories.models import Device
from rest_framework.response import Response
from rest_framework import status
from ipsecs.serializers.ipsecVpnSerializers import IpsecVpnSerializer
from ipsecs.scripts.ipsecvpn.getipsecvpn import get_ipsecvpn,normalized_vpn
from ipsecs.scripts.ipsecvpn.serialized_data import format_set, push_junos_config,generate_delete_ipsecVpn

class IPsecVpnListView(ListAPIView):
    serializer_class = IpsecVpnSerializer

    def get_device(self, device_value):
        try:
            return Device.objects.get(device_name=device_value)
        except Device.DoesNotExist:
            return None

    def get_queryset(self):
        device_value = self.request.query_params.get('device')
        device = self.get_device(device_value)
        return IpsecVpn.objects.filter(device=device) if device else IpsecVpn.objects.none()

    def list(self, request, *args, **kwargs):
        device_value = request.query_params.get('device')
        if not device_value:
            return Response({"error": "Device not found"}, status=status.HTTP_404_NOT_FOUND)

        device = self.get_device(device_value)
        if not device:
            return Response({"error": "Device not found"}, status=status.HTTP_404_NOT_FOUND)

        if device.status != "up":
            return Response(
                {"error": f"Device status is '{device.status}'. Config push is only allowed when device is up."},
                status=status.HTTP_400_BAD_REQUEST
            )
        db_queryset = self.get_queryset()
        db_serialized_data = self.get_serializer(db_queryset, many=True).data
        raw_device_data = get_ipsecvpn(device.ip_address, device.username, device.password)
        if not raw_device_data:
            return Response(db_serialized_data)
        normalized_data = []
        for ipsec in raw_device_data:
            normalized = normalized_vpn(ipsec)
            if isinstance(normalized, dict):
                normalized_data.append(normalized)

        db_names = [item['vpn_name'] for item in db_serialized_data]
        device_names = [item['vpn_name'] for item in normalized_data]
        missing_names = set(device_names) - set(db_names)
        if missing_names:
            missing_vpns = [vpn for vpn in normalized_data if vpn['vpn_name'] in missing_names]
            required_fields = ['vpn_name']
            created_vpn_list = []
            for vpn in missing_vpns:
                if not all(vpn.get(field) for field in required_fields):
                    print(f"Skipping VPN: {vpn.get('vpn_name', 'unknown')} (missing fields)")
                    continue
                serializer = IpsecVpnSerializer(data={**vpn, 'device': device.device_name})
                if serializer.is_valid():
                    serializer.save()
                    created_vpn_list.append(vpn['vpn_name'])
                else:
                    print(f"Failed to serialize {vpn['vpn_name']}: {serializer.errors}")
        final_queryset = IpsecVpn.objects.filter(device=device.id)
        final_serialized = self.get_serializer(final_queryset, many=True).data
        return Response(final_serialized)

ipsecvpn_list_view = IPsecVpnListView.as_view()

class IPsecVpnCreateView(CreateAPIView):
    queryset = IpsecVpn.objects.all()
    serializer_class = IpsecVpnSerializer

ipsecvpn_create_view = IPsecVpnCreateView.as_view()

class IPsecVpnDetailView(RetrieveAPIView):
    queryset = IpsecVpn.objects.all()
    serializer_class = IpsecVpnSerializer
    lookup_field = 'pk'

ipsecvpn_detail_view = IPsecVpnDetailView.as_view()

class IPsecVpnUpdateView(UpdateAPIView):  
    queryset = IpsecVpn.objects.all()
    serializer_class = IpsecVpnSerializer
    lookup_field = 'pk'

    def update(self, request, *args, **kwargs):
        device_name = request.data.get('device')
        if not device_name:
            return Response({'error': "Bad request"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            device = Device.objects.get(device_name=device_name)
        except Device.DoesNotExist:
            return Response({'error': "Device not found"}, status=status.HTTP_404_NOT_FOUND)

        obj = self.get_object()
        vpn_name = request.data.get('vpn_name')
        if not vpn_name:
            return Response({"error": " vpn name is required"}, status=status.HTTP_400_BAD_REQUEST)

        if IpsecVpn.objects.filter(vpn_name=vpn_name).exclude(pk=obj.pk).exists():
            return Response({"error": "Vpn name must be unique. This name already exists."}, status=status.HTTP_400_BAD_REQUEST)

        # Validate the data but do not save yet
        serializer = self.get_serializer(obj, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)

        if request.data.get('is_sendtodevice'):
            if device.status != "up":
                return Response(
                    {"error": f"Device status is '{device.status}'. Config push is only allowed when device is up."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            config = format_set(request.data)
            success, result = push_junos_config(
                device.ip_address,
                device.username,
                device.password,
                config,
            )
            if not success:
                return Response({"error": result}, status=status.HTTP_400_BAD_REQUEST)

        self.perform_update(serializer)
        return Response(serializer.data)
    
    
ipsecvpn_update_view = IPsecVpnUpdateView.as_view()

class IPsecVpnDestroyView(DestroyAPIView):
    queryset = IpsecVpn.objects.all()
    serializer_class = IpsecVpnSerializer
    lookup_field = 'pk'

    def delete(self, request, *args, **kwargs):
        obj = self.get_object()  
        device = obj.device
        vpn_name = obj.vpn_name
        config = generate_delete_ipsecVpn(vpn_name)
        success, result = push_junos_config(
            device.ip_address,
            device.username,
            device.password,
            config
        )
        if success:
            return super().delete(request, *args, **kwargs)
        return Response({"detail": "Failed to delete vpn name from device", "error": result},
            status=status.HTTP_400_BAD_REQUEST)

ipsecvpn_delete_view = IPsecVpnDestroyView.as_view()
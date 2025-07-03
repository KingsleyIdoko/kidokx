from django.shortcuts import render
from rest_framework.generics import ListAPIView, CreateAPIView, DestroyAPIView, UpdateAPIView, RetrieveAPIView
from ipsecs.models import IpsecVpn
from inventories.models import Device
from rest_framework.response import Response
from rest_framework import status
from interfaces.models import Interface
from ipsecs.serializers.ipsecVpnSerializers import IpsecVpnSerializer
from ipsecs.scripts.ipsecvpn.getipsecvpn import get_ipsecvpn,normalized_vpn
from ipsecs.scripts.ipsecvpn.serialized_data import format_set,generate_delete_ipsecVpn
from ipsecs.scripts.utilities.push_config import push_junos_config



class IPsecVpnListView(ListAPIView):
    serializer_class = IpsecVpnSerializer

    def get_device(self, device_value):
        return Device.objects.filter(device_name=device_value).first()

    def get_queryset(self, device):
        return IpsecVpn.objects.filter(device=device) if device else IpsecVpn.objects.none()

    def fetch_and_normalize_device_data(self, device):
        raw_device_data = get_ipsecvpn(device.ip_address, device.username, device.password)
        if not raw_device_data:
            return []
        return [normalized_vpn(ipsec) for ipsec in raw_device_data if isinstance(normalized_vpn(ipsec), dict)
        ]
    def match_interface(self, bind_interface_name, interfaces_by_name):
        # Check exact match first
        if bind_interface_name in interfaces_by_name:
            return interfaces_by_name[bind_interface_name]

        # Check for base interface if sub-interface provided
        base_if = bind_interface_name.split(".")[0]
        return interfaces_by_name.get(base_if)

    def create_missing_vpns(self, missing_vpns, device, interfaces_by_name):
        created_vpns = []
        for vpn in missing_vpns:
            bind_interface_name = vpn.get("bind_interface")
            if bind_interface_name:
                interface_obj = self.match_interface(bind_interface_name, interfaces_by_name)
                if not interface_obj:
                    print(f"Skipping VPN '{vpn['vpn_name']}' - Interface '{bind_interface_name}' not found.")
                    continue
                vpn["bind_interface"] = interface_obj.name

            serializer = IpsecVpnSerializer(data={**vpn, 'device': device.device_name})
            if serializer.is_valid():
                serializer.save()
                created_vpns.append(vpn['vpn_name'])
            else:
                print(f"Failed to serialize {vpn['vpn_name']}: {serializer.errors}")
        return created_vpns

    def list(self, request, *args, **kwargs):
        device_value = request.query_params.get('device')
        if not device_value:
            return Response({"error": "Device parameter is required."}, status=status.HTTP_400_BAD_REQUEST)
        device = self.get_device(device_value)
        if not device:
            return Response({"error": "Device not found."}, status=status.HTTP_404_NOT_FOUND)
        if device.status != "up":
            return Response(
                {"error": f"Device status is '{device.status}'. Configuration sync is only allowed when device is 'up'."},
                status=status.HTTP_400_BAD_REQUEST
            )
        db_queryset = self.get_queryset(device)
        db_serialized_data = self.get_serializer(db_queryset, many=True).data
        db_vpn_names = {item['vpn_name'] for item in db_serialized_data}
        device_vpn_data = self.fetch_and_normalize_device_data(device)
        device_vpn_names = {item['vpn_name'] for item in device_vpn_data}
        missing_names = device_vpn_names - db_vpn_names
        missing_vpns = [vpn for vpn in device_vpn_data if vpn['vpn_name'] in missing_names]
        interfaces_by_name = {
            iface.name: iface
            for iface in Interface.objects.filter(device=device)
        }
        created_vpns = self.create_missing_vpns(missing_vpns, device, interfaces_by_name)
        final_queryset = self.get_queryset(device)
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
        if obj.is_published:
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
        return super().delete(request, *args, **kwargs)

ipsecvpn_delete_view = IPsecVpnDestroyView.as_view()
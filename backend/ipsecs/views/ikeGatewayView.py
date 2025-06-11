from django.shortcuts import render
from rest_framework.generics import ListAPIView, CreateAPIView, DestroyAPIView, UpdateAPIView, RetrieveAPIView
from ipsecs.models import IkeGateway, IkePolicy
from ipsecs.serializers.ikeGatewaySerializers import IkeGatewaySerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from inventories.models import Device
from ipsecs.scripts.ikegateways.getikegateway import serialized_ikegateway_policies, device_ikegateway_policies
from ipsecs.scripts.ikegateways.serialized_data import push_junos_config, serialized_ikegateway,serialized_delete_gateway



class IkeGatewayListView(ListAPIView):
    serializer_class = IkeGatewaySerializer

    def get_queryset(self):
        device_value = self.request.query_params.get('device')
        if device_value:
            try:
                device = Device.objects.get(device_name=device_value)
                return IkeGateway.objects.filter(device=device)
            except Device.DoesNotExist:
                return IkeGateway.objects.none()
        return IkeGateway.objects.none()

    def list(self, request, *args, **kwargs):
        device_name = request.query_params.get('device')
        if not device_name:
            return Response({'error': 'Device is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            device = Device.objects.get(device_name=device_name)
        except Device.DoesNotExist:
            return Response({'error': 'Device not found'}, status=status.HTTP_404_NOT_FOUND)

        queryset = self.get_queryset()
        db_serialized_data = self.get_serializer(queryset, many=True).data

        try:
            raw_device_data = device_ikegateway_policies(
                username=device.username,
                password=device.password,
                host=device.ip_address
            )
            if not raw_device_data:
                return Response(db_serialized_data)
        except Exception:
            return Response(db_serialized_data)

        serialized_gateways = []
        for gw in raw_device_data:
            try:
                parsed = serialized_ikegateway_policies(gw)
                if parsed and all(parsed.get(k) for k in ['gatewayname', 'ike_policy', 'remote_address', 'local_address', 'external_interface', 'ike_version']):
                    serialized_gateways.append(parsed)
                else:
                    print(f"Skipping incomplete gateway data: {parsed}")
            except Exception as e:
                print(f"Failed to parse gateway: {gw}, error: {e}")

        db_gateway_names = {item['gatewayname'] for item in db_serialized_data}
        device_gateway_names = {item['gatewayname'] for item in serialized_gateways}

        missing_names = device_gateway_names - db_gateway_names
        missing_gateways = [gw for gw in serialized_gateways if gw['gatewayname'] in missing_names]

        created = []
        for gw in missing_gateways:
            policy_obj = IkePolicy.objects.filter(policyname=gw['ike_policy'], device=device).first()
            if not policy_obj:
                print(f"Missing policy object for '{gw['ike_policy']}' — skipping gateway '{gw['gatewayname']}'")
                continue

            serializer = IkeGatewaySerializer(data={
                'gatewayname': gw['gatewayname'],
                'device': device.device_name,
                'ike_policy': policy_obj.policyname,
                'external_interface': gw['external_interface'],
                'remote_address': gw['remote_address'],
                'local_address': gw['local_address'],
                'ike_version': gw['ike_version'],
                'is_published': gw.get('is_published', True),
            })

            if serializer.is_valid():
                serializer.save()
                created.append(gw['gatewayname'])
            else:
                print(f"Serializer errors for gateway '{gw['gatewayname']}':", serializer.errors)

        # <- FIXED: moved out of the for-loop
        updated_queryset = self.get_queryset()
        return Response(self.get_serializer(updated_queryset, many=True).data)


ikegateway_list_view = IkeGatewayListView.as_view()

class IkeGatewayCreateView(CreateAPIView):
    queryset = IkeGateway.objects.all()
    serializer_class = IkeGatewaySerializer

ikegateway_create_view = IkeGatewayCreateView.as_view()

class IkeGatewayDetailView(RetrieveAPIView):
    queryset = IkeGateway.objects.all()
    serializer_class = IkeGatewaySerializer
    lookup_field = 'pk'

ikegateway_detail_view = IkeGatewayDetailView.as_view()

class IkeGatewayUpdateView(UpdateAPIView):  
    queryset = IkeGateway.objects.all()
    serializer_class = IkeGatewaySerializer
    lookup_field = 'pk'

    def update(self, request, *args, **kwargs):
        device_value = request.data.get('device')
        device = None

        if isinstance(device_value, str) and not device_value.isdigit():
            device = Device.objects.filter(device_name=device_value).first()
            if not device:
                return Response({"error": "Device not found"}, status=status.HTTP_404_NOT_FOUND)
            request.data['device'] = device.device_name
        elif str(device_value).isdigit():
            device = Device.objects.filter(id=device_value).first()
            if not device:
                return Response({"error": "Device not found"}, status=status.HTTP_404_NOT_FOUND)

        obj = self.get_object()
        gatewayname = request.data.get('gatewayname')
        if not gatewayname:
            return Response({"error": "Gateway name is required"}, status=status.HTTP_400_BAD_REQUEST)
        if IkeGateway.objects.filter(gatewayname=gatewayname).exclude(pk=obj.pk).exists():
            return Response({"error": "Gateway name must be unique. This name already exists."}, status=status.HTTP_400_BAD_REQUEST)

        response = super().update(request, *args, **kwargs)

        if request.data.get('is_sendtodevice'):
            updated_gateway = {
                "gatewayname": gatewayname,
                "ike_policy": request.data.get('ike_policy'),
                "remote_address": request.data.get('remote_address'),
                "local_address": request.data.get('local_address'),
                "external_interface": request.data.get('external_interface'),
                "ike_version": request.data.get('ike_version'),
            }
            old_gateways = IkeGateway.objects.filter(device=device).exclude(pk=obj.pk).values_list('gatewayname', flat=True)
            if gatewayname not in old_gateways:
                config = serialized_ikegateway(updated_gateway)
                success, result = push_junos_config(
                    device.ip_address, device.username, device.password, config
                )
                if not success:
                    return Response(
                        {"error": f"Failed to push config to device: {result}"},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR
                    )

        return response
ikegateway_update_view = IkeGatewayUpdateView.as_view()


class IkeGatewayDestroyView(DestroyAPIView):
    queryset = IkeGateway.objects.all()
    serializer_class = IkeGatewaySerializer
    lookup_field = 'pk'

    def delete(self, request, *args, **kwargs):
        obj = self.get_object()  
        device = obj.device
        gatewayname = obj.gatewayname
        print(device.ip_address)
        config = serialized_delete_gateway(gatewayname)
        success, result = push_junos_config(
            device.ip_address,
            device.username,
            device.password,
            config
        )
        if success:
            return super().delete(request, *args, **kwargs)
        return Response(
            {"detail": "Failed to delete gateway from device", "error": result},
            status=status.HTTP_400_BAD_REQUEST
        )
ikegateway_delete_view = IkeGatewayDestroyView.as_view()

class IkeGatewayNamesView(APIView):
    def get(self, request):
        device = request.query_params.get("device")
        obj = Device.objects.get(device_name=device)
        if not device:
            return Response({"error": "Missing 'device' query parameter"}, status=400)
        ikegatewaynames = IkeGateway.objects.filter(device=obj.id).values_list("gatewayname", flat=True)
        return Response(ikegatewaynames)
ikegateway_names_view = IkeGatewayNamesView.as_view()


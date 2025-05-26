from django.shortcuts import render
from rest_framework.generics import ListAPIView, CreateAPIView, DestroyAPIView, UpdateAPIView, RetrieveAPIView
from ipsecs.models import IkeGateway, IkePolicy
from ipsecs.serializers.ikeGatewaySerializers import IkeGatewaySerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from inventories.models import Device
from ipsecs.scripts.ikegateways.getikegateway import serialized_ikegateway_policies, device_ikegateway_policies



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

        serialized_gateways = [serialized_ikegateway_policies(gw) for gw in raw_device_data]

        db_gateway_names = {item['gatewayname'] for item in db_serialized_data}
        device_gateway_names = {item['gatewayname'] for item in serialized_gateways}

        missing_names = device_gateway_names - db_gateway_names
        missing_gateways = [gw for gw in serialized_gateways if gw['gatewayname'] in missing_names]

        created = []
        for gw in missing_gateways:
            policy_obj = IkePolicy.objects.filter(policyname=gw['ike_policy'], device=device).first()
            print(policy_obj)
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
                'is_published': gw['is_published'],
            })
            if serializer.is_valid():
                serializer.save()
                created.append(gw['gatewayname'])
            else:
                print(f"Serializer errors for gateway '{gw['gatewayname']}':", serializer.errors)

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
ikegateway_update_view = IkeGatewayUpdateView.as_view()

class IkeGatewayDestroyView(DestroyAPIView):
    queryset = IkeGateway.objects.all()
    serializer_class = IkeGatewaySerializer
    lookup_field = 'pk'

ikegateway_delete_view = IkeGatewayDestroyView.as_view()


class IkeGatewayNamesView(APIView):
    def get(self, request):
        ikegatewaynames = IkeGateway.objects.values_list('gatewayname', flat=True)
        return Response(ikegatewaynames )  
ikegateway_names_view = IkeGatewayNamesView.as_view()


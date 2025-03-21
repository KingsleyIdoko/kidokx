
from django.shortcuts import render
from rest_framework.generics import ListAPIView, CreateAPIView, DestroyAPIView, UpdateAPIView, RetrieveAPIView
from ipsecs.models import IkeGateway
from rest_framework.views import APIView
from rest_framework.response import Response
from ipsecs.serializers.ikeGatewaySerializers import IkeGatewaySerializer

class IkeGatewayListView(ListAPIView):
    queryset = IkeGateway.objects.all()
    serializer_class = IkeGatewaySerializer
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
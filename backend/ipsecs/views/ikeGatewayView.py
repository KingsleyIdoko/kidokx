from django.shortcuts import render
from rest_framework.generics import ListAPIView, CreateAPIView, DestroyAPIView, UpdateAPIView, RetrieveAPIView
from ipsecs.models import IkeGateway
from ipsecs.serializers.ikeGatewaySerializers import IkeGatewaySerializer
from rest_framework.views import APIView
from rest_framework.response import Response

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


class IkeGatewayNamesView(APIView):
    def get(self, request):
        ikegatewaynames = IkeGateway.objects.values_list('gatewayname', flat=True)
        return Response(ikegatewaynames )  
ikegateway_names_view = IkeGatewayNamesView.as_view()


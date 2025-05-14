from django.shortcuts import render
from rest_framework.generics import ListAPIView, CreateAPIView, DestroyAPIView, UpdateAPIView, RetrieveAPIView
from ipsecs.models import IpsecVpn
from ipsecs.serializers.ipsecVpnSerializers import IpsecVpnSerializer

class IPsecVpnListView(ListAPIView):
    queryset = IpsecVpn.objects.all()
    serializer_class = IpsecVpnSerializer
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
    
ipsecvpn_update_view = IPsecVpnUpdateView.as_view()

class IPsecVpnDestroyView(DestroyAPIView):
    queryset = IpsecVpn.objects.all()
    serializer_class = IpsecVpnSerializer
    lookup_field = 'pk'

ipsecvpn_delete_view = IPsecVpnDestroyView.as_view()
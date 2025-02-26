
from django.shortcuts import render
from rest_framework.generics import ListAPIView, CreateAPIView, DestroyAPIView, UpdateAPIView, RetrieveAPIView
from ipsecs.models import IpsecVpn
from ipsecs.serializers.ipsecVpnSerializers import IpsecVpnSerializer

class IkeProposalListView(ListAPIView):
    queryset = IpsecVpn.objects.all()
    serializer_class = IpsecVpnSerializer
ipsecvpn_list_view = IkeProposalListView.as_view()

class IkeProposalCreateView(CreateAPIView):
    queryset = IpsecVpn.objects.all()
    serializer_class = IpsecVpnSerializer

ipsecvpn_create_view = IkeProposalCreateView.as_view()

class IkeProposalDetailView(RetrieveAPIView):
    queryset = IpsecVpn.objects.all()
    serializer_class = IpsecVpnSerializer
    lookup_field = 'pk'

ipsecvpn_detail_view = IkeProposalDetailView.as_view()

class IkeProposalUpdateView(UpdateAPIView):  
    queryset = IpsecVpn.objects.all()
    serializer_class = IpsecVpnSerializer
    lookup_field = 'pk'
ipsecvpn_update_view = IkeProposalUpdateView.as_view()

class IkeProposalDestroyView(DestroyAPIView):
    queryset = IpsecVpn.objects.all()
    serializer_class = IpsecVpnSerializer
    lookup_field = 'pk'

ipsecvpn_delete_view = IkeProposalDestroyView.as_view()

from django.shortcuts import render
from rest_framework.generics import ListAPIView, CreateAPIView, DestroyAPIView, UpdateAPIView, RetrieveAPIView
from ipsecs.models import IpsecPolicy
from ipsecs.serializers.ipsecPolicySerializers import IpsecPolicySerializer

class IkeProposalListView(ListAPIView):
    queryset = IpsecPolicy.objects.all()
    serializer_class = IpsecPolicySerializer
ipsecpolicy_list_view = IkeProposalListView.as_view()

class IkeProposalCreateView(CreateAPIView):
    queryset = IpsecPolicy.objects.all()
    serializer_class = IpsecPolicySerializer

ipsecpolicy_create_view = IkeProposalCreateView.as_view()

class IkeProposalDetailView(RetrieveAPIView):
    queryset = IpsecPolicy.objects.all()
    serializer_class = IpsecPolicySerializer
    lookup_field = 'pk'

ipsecpolicy_detail_view = IkeProposalDetailView.as_view()

class IkeProposalUpdateView(UpdateAPIView):  
    queryset = IpsecPolicy.objects.all()
    serializer_class = IpsecPolicySerializer
    lookup_field = 'pk'
ipsecpolicy_update_view = IkeProposalUpdateView.as_view()

class IkeProposalDestroyView(DestroyAPIView):
    queryset = IpsecPolicy.objects.all()
    serializer_class = IpsecPolicySerializer
    lookup_field = 'pk'

ipsecpolicy_delete_view = IkeProposalDestroyView.as_view()
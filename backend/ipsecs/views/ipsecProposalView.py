
from django.shortcuts import render
from ipsecs.models import IpsecProposal
from ipsecs.serializers.ipsecProposalSerializers import IpsecProposalSerializer
from rest_framework.generics import ListAPIView, CreateAPIView, DestroyAPIView, UpdateAPIView, RetrieveAPIView

class ipsecProposalListView(ListAPIView):
    queryset = IpsecProposal.objects.all()
    serializer_class = IpsecProposalSerializer
ipsecproposal_list_view = ipsecProposalListView.as_view()

class IpsecProposalCreateView(CreateAPIView):
    queryset = IpsecProposal.objects.all()
    serializer_class = IpsecProposalSerializer

    def perform_create(self, serializer):
        print(self.request.data)  
        serializer.save()

ipsecproposal_create_view = IpsecProposalCreateView.as_view()

class ipsecProposalDetailView(RetrieveAPIView):
    queryset = IpsecProposal.objects.all()
    serializer_class = IpsecProposalSerializer
    lookup_field = 'pk'

ipsecproposal_detail_view = ipsecProposalDetailView.as_view()

class ipsecProposalUpdateView(UpdateAPIView):  
    queryset = IpsecProposal.objects.all()
    serializer_class = IpsecProposalSerializer
    lookup_field = 'pk'
ipsecproposal_update_view = ipsecProposalUpdateView.as_view()

class ipsecProposalDestroyView(DestroyAPIView):
    queryset = IpsecProposal.objects.all()
    serializer_class = IpsecProposalSerializer
    lookup_field = 'pk'

ipsecproposal_delete_view = ipsecProposalDestroyView.as_view()
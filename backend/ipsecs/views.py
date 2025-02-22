from django.shortcuts import render
from rest_framework.generics import ListAPIView, CreateAPIView, DestroyAPIView, UpdateAPIView, RetrieveAPIView
from .models import IpsecProposal
from .serializers import IpsecProposalSerializer


class IpsecProposalListView(ListAPIView):
    queryset = IpsecProposal.objects.all()
    serializer_class = IpsecProposalSerializer

proposal_list_view = IpsecProposalListView.as_view()

class IpsecProposalCreateView(CreateAPIView):
    queryset = IpsecProposal.objects.all()
    serializer_class = IpsecProposalSerializer

proposal_create_view = IpsecProposalCreateView.as_view()

class IpsecProposalDetailView(RetrieveAPIView):
    queryset = IpsecProposal.objects.all()
    serializer_class = IpsecProposalSerializer
    lookup_field = 'pk'

proposal_detail_view = IpsecProposalDetailView.as_view()

class IpsecProposalUpdateView(UpdateAPIView):  
    queryset = IpsecProposal.objects.all()
    serializer_class = IpsecProposalSerializer
    lookup_field = 'pk'
proposal_update_view = IpsecProposalUpdateView.as_view()

class IpsecProposalDestroyView(DestroyAPIView):
    queryset = IpsecProposal.objects.all()
    serializer_class = IpsecProposalSerializer
    lookup_field = 'pk'

proposal_delete_view = IpsecProposalDestroyView.as_view()
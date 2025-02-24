from django.shortcuts import render
from rest_framework.generics import ListAPIView, CreateAPIView, DestroyAPIView, UpdateAPIView, RetrieveAPIView
from .models import IkeProposal
from .serializers import IkeProposalSerializer


class IkeProposalListView(ListAPIView):
    queryset = IkeProposal.objects.all()
    serializer_class = IkeProposalSerializer

proposal_list_view = IkeProposalListView.as_view()

class IkeProposalCreateView(CreateAPIView):
    queryset = IkeProposal.objects.all()
    serializer_class = IkeProposalSerializer

proposal_create_view = IkeProposalCreateView.as_view()

class IkeProposalDetailView(RetrieveAPIView):
    queryset = IkeProposal.objects.all()
    serializer_class = IkeProposalSerializer
    lookup_field = 'pk'

proposal_detail_view = IkeProposalDetailView.as_view()

class IkeProposalUpdateView(UpdateAPIView):  
    queryset = IkeProposal.objects.all()
    serializer_class = IkeProposalSerializer
    lookup_field = 'pk'
proposal_update_view = IkeProposalUpdateView.as_view()

class IkeProposalDestroyView(DestroyAPIView):
    queryset = IkeProposal.objects.all()
    serializer_class = IkeProposalSerializer
    lookup_field = 'pk'

proposal_delete_view = IkeProposalDestroyView.as_view()
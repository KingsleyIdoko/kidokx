
from django.shortcuts import render
from rest_framework.generics import ListAPIView, CreateAPIView, DestroyAPIView, UpdateAPIView, RetrieveAPIView
from  ipsecs.models import IkeProposal
from rest_framework.views import APIView
from rest_framework.response import Response
from ipsecs.serializers.ikeProposalSerializers import IkeProposalSerializer

class IkeProposalListView(ListAPIView):
    queryset = IkeProposal.objects.all()
    serializer_class = IkeProposalSerializer
ikeproposal_list_view = IkeProposalListView.as_view()

class IkeProposalCreateView(CreateAPIView):
    queryset = IkeProposal.objects.all()
    serializer_class = IkeProposalSerializer

ikeproposal_create_view = IkeProposalCreateView.as_view()

class IkeProposalDetailView(RetrieveAPIView):
    queryset = IkeProposal.objects.all()
    serializer_class = IkeProposalSerializer
    lookup_field = 'pk'

ikeproposal_detail_view = IkeProposalDetailView.as_view()

class IkeProposalUpdateView(UpdateAPIView):  
    queryset = IkeProposal.objects.all()
    serializer_class = IkeProposalSerializer
    lookup_field = 'pk'
ikeproposal_update_view = IkeProposalUpdateView.as_view()

class IkeProposalDestroyView(DestroyAPIView):
    queryset = IkeProposal.objects.all()
    serializer_class = IkeProposalSerializer
    lookup_field = 'pk'

ikeproposal_delete_view = IkeProposalDestroyView.as_view()


class IkeProposalListNames(APIView):
    def get(self, request):
        names = IkeProposal.objects.values_list('name', flat=True)
        return Response(names)  
ikeproposal_names_view = IkeProposalListNames.as_view()

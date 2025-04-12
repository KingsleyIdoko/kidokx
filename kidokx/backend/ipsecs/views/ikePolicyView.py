
from django.shortcuts import render
from rest_framework.generics import ListAPIView, CreateAPIView, DestroyAPIView, UpdateAPIView, RetrieveAPIView
from ipsecs.models import IkePolicy
from rest_framework.views import APIView
from rest_framework.response import Response
from ipsecs.serializers.ikePolicySerializers import IkePolicySerializer

class IkePolicyListView(ListAPIView):
    queryset = IkePolicy.objects.all()
    serializer_class = IkePolicySerializer
ikepolicy_list_view = IkePolicyListView.as_view()

class IkePolicyCreateView(CreateAPIView):
    queryset = IkePolicy.objects.all()
    serializer_class = IkePolicySerializer


    def perform_create(self, serializer):
        print("Creating IkePolicy Proposal:", serializer.validated_data)
        serializer.save()

ikepolicy_create_view = IkePolicyCreateView.as_view()

class IkePolicyDetailView(RetrieveAPIView):
    queryset = IkePolicy.objects.all()
    serializer_class = IkePolicySerializer
    lookup_field = 'pk'

ikepolicy_detail_view = IkePolicyDetailView.as_view()

class IkePolicyUpdateView(UpdateAPIView):  
    queryset = IkePolicy.objects.all()
    serializer_class = IkePolicySerializer
    lookup_field = 'pk'
ikepolicy_update_view = IkePolicyUpdateView.as_view()

class IkePolicyDestroyView(DestroyAPIView):
    queryset = IkePolicy.objects.all()
    serializer_class = IkePolicySerializer
    lookup_field = 'pk'

ikepolicy_delete_view = IkePolicyDestroyView.as_view()


class IkePolicylListNames(APIView):
    def get(self, request):
        names = IkePolicy.objects.values_list('policyname', flat=True)
        return Response(names)  
ikepolicy_names_view = IkePolicylListNames.as_view()
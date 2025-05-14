from django.shortcuts import render
from rest_framework.generics import ListAPIView, CreateAPIView, DestroyAPIView, UpdateAPIView, RetrieveAPIView
from rest_framework.views import APIView
from rest_framework.response import Response
from ..models import Site
from ..serializers import SiteSerializer


class SiteListView(ListAPIView):
    queryset = Site.objects.all()
    serializer_class = SiteSerializer

site_list_view = SiteListView.as_view()

class SiteCreateView(CreateAPIView):
    queryset = Site.objects.all()
    serializer_class = SiteSerializer

site_create_view = SiteCreateView.as_view()

class SiteDetailView(RetrieveAPIView):
    queryset = Site.objects.all()
    serializer_class = SiteSerializer
    lookup_field = 'pk'

site_detail_view = SiteDetailView.as_view()

class SiteUpdateView(UpdateAPIView):  
    queryset = Site.objects.all()
    serializer_class = SiteSerializer
    lookup_field = 'pk'
site_update_view = SiteUpdateView.as_view()

class SiteDestroyView(DestroyAPIView):
    queryset = Site.objects.all()
    serializer_class = SiteSerializer
    lookup_field = 'pk'
site_delete_view = SiteDestroyView.as_view()

class SiteListNames(APIView):
    def get(self, request, *args, **kwargs):
        sitelists = Site.objects.values_list("site_name", flat=True)
        return Response(sitelists)

site_names_view = SiteListNames.as_view()
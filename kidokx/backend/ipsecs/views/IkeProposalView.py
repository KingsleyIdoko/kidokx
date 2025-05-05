
from django.shortcuts import render
from rest_framework.generics import ListAPIView, CreateAPIView, DestroyAPIView, UpdateAPIView, RetrieveAPIView
from  ipsecs.models import IkeProposal
from rest_framework.views import APIView
from rest_framework.response import Response
from ipsecs.serializers.ikeProposalSerializers import IkeProposalSerializer
from ipsecs.netconf.netconf_client import get_junos_ike_proposals,normalize_device_proposal
from nornir import InitNornir
from inventories.models import Device
from rest_framework import status


class IKEProposalListView(ListAPIView):
    serializer_class = IkeProposalSerializer
    def get_queryset(self):
        device_name = self.request.query_params.get("device")
        if device_name:
            try:
                device = Device.objects.get(device_name=device_name)
                return IkeProposal.objects.filter(device=device)
            except Device.DoesNotExist:
                return IkeProposal.objects.none()
        return IkeProposal.objects.none()

    def list(self, request, *args, **kwargs):
        device_name = request.query_params.get("device")
        if not device_name:
            return Response({"error": "Device is required"}, status=400)

        try:
            device = Device.objects.get(device_name=device_name)
        except Device.DoesNotExist:
            return Response({"error": "Device not found"}, status=404)

        # Get proposals from DB
        queryset = self.get_queryset()
        db_serialized = self.get_serializer(queryset, many=True).data
        db_names = {item["proposalname"] for item in db_serialized}

        # Fetch from device
        try:
            raw_device_data = get_junos_ike_proposals(
                host=device.ip_address,
                username=device.username,
                password=device.password
            )
            print(raw_device_data)
        except Exception as e:
            return Response({"error": str(e)}, status=500)

        normalized_proposals = [normalize_device_proposal(p) for p in raw_device_data]
        device_names = {p["proposalname"] for p in normalized_proposals}

        missing_names = device_names - db_names
        missing_proposals = [p for p in normalized_proposals if p["proposalname"] in missing_names]

        # Post new proposals to the backend using serializer (like CreateAPIView)
        created = []
        for p in missing_proposals:
            serializer = IkeProposalSerializer(data={**p, "device": device.id})
            if serializer.is_valid():
                serializer.save()
                created.append(p["proposalname"])
            else:
                print("Serializer errors:", serializer.errors)

        # Only return stored data
        final_queryset = IkeProposal.objects.filter(device=device)
        serialized = self.get_serializer(final_queryset, many=True).data

        return Response(serialized)

ikeproposal_list_view = IKEProposalListView.as_view()

class IkeProposalCreateView(CreateAPIView):
    serializer_class = IkeProposalSerializer

    def get_queryset(self):
        device_name = self.request.query_params.get("device")
        if device_name:
            try:
                device = Device.objects.get(device_name=device_name)
                return IkeProposal.objects.filter(device=device)
            except Device.DoesNotExist:
                return IkeProposal.objects.none()
        return IkeProposal.objects.none()

    def create(self, request, *args, **kwargs):
        proposalname = request.data.get("proposalname")
        if IkeProposal.objects.filter(proposalname=proposalname).exists():
            return Response(
                {"error": "Proposal name must be unique. This name already exists."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return super().create(request, *args, **kwargs)

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
        names = IkeProposal.objects.values_list('proposalname', flat=True)
        return Response(names)  
ikeproposal_names_view = IkeProposalListNames.as_view()

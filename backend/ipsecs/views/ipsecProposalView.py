
from django.shortcuts import render
from ipsecs.models import IpsecProposal
from inventories.models import Device
from rest_framework.response import Response
from rest_framework import status
from ipsecs.serializers.ipsecProposalSerializers import IpsecProposalSerializer
from rest_framework.generics import ListAPIView, CreateAPIView, DestroyAPIView, UpdateAPIView, RetrieveAPIView
from ipsecs.scripts.ipsecproposal.getipsecproposal import get_ipsecproposals,serialized_ipsecproposals_policies

class ipsecProposalListView(ListAPIView):
    queryset = IpsecProposal.objects.all()
    serializer_class = IpsecProposalSerializer

    def get_queryset(self):
        device_value = self.request.query_params.get('device')
        if device_value:
            try:
                device = Device.objects.get(device_name=device_value)
                return IpsecProposal.objects.filter(device=device)
            except Device.DoesNotExist:
                return IpsecProposal.objects.none()
        return IpsecProposal.objects.none()

    def list(self, request, *args, **kwargs):
        device_value = request.query_params.get('device')
        if not device_value:
            return Response({"error": "Device not found"}, status=status.HTTP_404_NOT_FOUND)
        try:
            device = Device.objects.get(device_name=device_value)
        except Device.DoesNotExist:
            return Response({"error": "Device not found"}, status=status.HTTP_404_NOT_FOUND)

        queryset = self.get_queryset()
        db_serialized_data = self.get_serializer(queryset, many=True).data

        raw_device_data = get_ipsecproposals(
            device.ip_address,
            device.username,
            device.password
        )
        if not raw_device_data:
            return Response(db_serialized_data)

        normalized_data = [
        serialized_ipsecproposals_policies(ipsec_prop)
        for ipsec_prop in raw_device_data
        if isinstance(serialized_ipsecproposals_policies(ipsec_prop), dict)]
        db_names = [db_proposal['proposalname'] for db_proposal in db_serialized_data]
        device_names = [device_proposal['proposalname'] for device_proposal in normalized_data]
        missing_names = set(device_names) - set(db_names)
        missing_proposals = [p for p in normalized_data if p['proposalname'] in missing_names]
        required_fields = ['proposalname', 'encapsulation_protocol', 'encryption_algorithm']
        created_proposals_list = []
        for p in missing_proposals:
            if any(p.get(field) in [None, ''] for field in required_fields):
                print(f"Skipping invalid proposal: {p['proposalname']} (missing required fields)")
                continue
            serializer = IpsecProposalSerializer(data={**p, 'device': device.device_name})
            if serializer.is_valid():
                serializer.save()
                created_proposals_list.append(p['proposalname'])
            else:
                print("Serializer errors:", serializer.errors)

        final_query = IpsecProposal.objects.filter(device=device.id)
        serialized_data = self.get_serializer(final_query, many=True).data
        return Response(serialized_data)

ipsecproposal_list_view = ipsecProposalListView.as_view()

class IpsecProposalCreateView(CreateAPIView):
    queryset = IpsecProposal.objects.all()
    serializer_class = IpsecProposalSerializer


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

from django.shortcuts import render
from ipsecs.models import IpsecProposal
from inventories.models import Device
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from ipsecs.serializers.ipsecProposalSerializers import IpsecProposalSerializer
from rest_framework.generics import ListAPIView, CreateAPIView, DestroyAPIView, UpdateAPIView, RetrieveAPIView
from ipsecs.scripts.ipsecproposal.getipsecproposal import get_ipsecproposals,serialized_ipsecproposals_policies
from ipsecs.scripts.ipsecproposal.serialized_data import format_set,push_junos_config,generate_delete_proposal

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

    def update(self, request, *args, **kwargs):
        device_name = request.data.get('device')
        if not device_name:
            return Response({'error': "Bad request"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            device = Device.objects.get(device_name=device_name)
        except Device.DoesNotExist:
            return Response({'error': "Device not found"}, status=status.HTTP_404_NOT_FOUND)

        obj = self.get_object()
        proposalname = request.data.get('proposalname')
        if not proposalname:
            return Response({"error": "Proposal name is required"}, status=status.HTTP_400_BAD_REQUEST)

        if IpsecProposal.objects.filter(proposalname=proposalname).exclude(pk=obj.pk).exists():
            return Response({"error": "Proposal name must be unique. This name already exists."}, status=status.HTTP_400_BAD_REQUEST)

        # Validate the data but do not save yet
        serializer = self.get_serializer(obj, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)

        # If config must be pushed, do it before saving
        if request.data.get('is_sendtodevice'):
            print(request.data)
            config = format_set(request.data)
            success, result = push_junos_config(
                host=device.ip_address,
                username=device.username,
                password=device.password,
                config_set_string=config
            )
            if not success:
                print("Push to device failed:", result)
                return Response({"error": result}, status=status.HTTP_400_BAD_REQUEST)
        self.perform_update(serializer)
        return Response(serializer.data)


ipsecproposal_update_view = ipsecProposalUpdateView.as_view()

class ipsecProposalDestroyView(DestroyAPIView):
    queryset = IpsecProposal.objects.all()
    serializer_class = IpsecProposalSerializer
    lookup_field = 'pk'

    def delete(self, request, *args, **kwargs):
        obj = self.get_object()  
        device = obj.device
        proposalname = obj.proposalname
        is_published = request.data.get("is_published", False)
        if is_published:
            config = generate_delete_proposal(proposalname)
            success, result = push_junos_config(
                device.ip_address,
                device.username,
                device.password,
                config
            )
            if success:
                return super().delete(request, *args, **kwargs)
            return Response({"detail": "Failed to delete gateway from device", "error": result},
                status=status.HTTP_400_BAD_REQUEST)
        return super().delete(request, *args, **kwargs)
    
ipsecproposal_delete_view = ipsecProposalDestroyView.as_view()

class IpsecProposalNamesView(APIView):
    def get(self, request):
        device_name = request.query_params.get('device')
        if not device_name:
            return Response({'error': "Bad request"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            device = Device.objects.get(device_name=device_name)
        except Device.DoesNotExist:
            return Response({'error': "Device not found"}, status=status.HTTP_404_NOT_FOUND)

        ipsecproposalnames = IpsecProposal.objects.filter(device=device).values_list('proposalname', flat=True)
        return Response(ipsecproposalnames)

ipsecproposal_names_view = IpsecProposalNamesView.as_view()
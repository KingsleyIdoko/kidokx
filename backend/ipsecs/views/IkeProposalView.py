
from django.shortcuts import render
from rest_framework.generics import ListAPIView, CreateAPIView, DestroyAPIView, UpdateAPIView, RetrieveAPIView
from  ipsecs.models import IkeProposal
from rest_framework.views import APIView
from rest_framework.response import Response
from ipsecs.serializers.ikeProposalSerializers import IkeProposalSerializer
from ipsecs.scripts.ikeproposal.getproposals import get_junos_ike_proposals,normalize_device_proposal
from ipsecs.scripts.ikeproposal.serialized_data import serialized_ikeproposal,push_junos_config,serialized_delete_ikeproposal
from inventories.models import Device
from rest_framework import status
import traceback


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

        try:
            raw_device_data = get_junos_ike_proposals(
                host=device.ip_address,
                username=device.username,
                password=device.password
            )
            if not raw_device_data:
                return Response(db_serialized)  
        except Exception as e:
            return Response(db_serialized)  

        normalized_proposals = [normalize_device_proposal(p) for p in raw_device_data]
        db_names = {item["proposalname"] for item in db_serialized}
        device_names = {p["proposalname"] for p in normalized_proposals}
        validated_db_names = [item for item in db_names if item not in device_names]
        if validated_db_names:
                updated_policies = IkeProposal.objects.filter(proposalname__in=validated_db_names, device=device)
                for proposal in updated_policies:
                    proposal.is_published = False
                IkeProposal.objects.bulk_update(updated_policies, ['is_published'])
        missing_names = device_names - db_names
        missing_proposals = [p for p in normalized_proposals if p["proposalname"] in missing_names]

        created = []
        for p in missing_proposals:
            serializer = IkeProposalSerializer(data={**p, "device": device.id})
            if serializer.is_valid():
                serializer.save()
                created.append(p["proposalname"])
            else:
                print("Serializer errors:", serializer.errors)

        final_queryset = IkeProposal.objects.filter(device=device)
        serialized = self.get_serializer(final_queryset, many=True).data
        return Response(serialized)
ikeproposal_list_view = IKEProposalListView.as_view()

class IkeProposalCreateView(CreateAPIView):
    serializer_class = IkeProposalSerializer

    def create(self, request, *args, **kwargs):
        device_value = request.data.get("device")
        if isinstance(device_value, str) and not device_value.isdigit():
            try:
                device = Device.objects.get(device_name=device_value)
                mutable_data = request.data.copy()
                mutable_data["device"] = device.id
                request._full_data = mutable_data
            except Device.DoesNotExist:
                return Response(
                    {"device": "Device with this name does not exist."},
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

    def update(self, request, *args, **kwargs):
        try:
            device_value = request.data.get("device")
            if isinstance(device_value, str) and not device_value.isdigit():
                try:
                    device = Device.objects.get(device_name=device_value)
                    mutable_data = request.data.copy()
                    mutable_data["device"] = device.id
                    request._full_data = mutable_data
                except Device.DoesNotExist:
                    return Response(
                        {"device": "Device with this name does not exist."},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
            obj = self.get_object()
            if request.data.get("is_sendtodevice"):
                payload = [
                    request.data.get("proposalname"),
                    request.data.get("authentication_method"),
                    request.data.get("dh_group"),
                    request.data.get("authentication_algorithm"),
                    request.data.get("encryption_algorithm"),
                    request.data.get("lifetime_seconds"),
                ]
                device_id = request.data.get("device")
                old_proposals = list(
                    IkeProposal.objects.filter(device_id=device_id)
                    .exclude(pk=obj.pk)
                    .values_list("proposalname", flat=True)
                )
                config = serialized_ikeproposal(payload, old_proposals)
                device = Device.objects.get(pk=device_id)
                success, result = push_junos_config(
                    device.ip_address,
                    device.username,
                    device.password,
                    config 
                )
                if not success:
                    return Response(
                        {"error": f"Failed to push config to device: {result}"},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR
                    )
            return super().update(request, *args, **kwargs)
        except Exception as e:
            traceback.print_exc()  
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
ikeproposal_update_view = IkeProposalUpdateView.as_view()

class IkeProposalDestroyView(DestroyAPIView):
    queryset = IkeProposal.objects.all()
    serializer_class = IkeProposalSerializer
    lookup_field = 'pk'

    def delete(self, request, *args, **kwargs):
        obj = self.get_object()
        device = obj.device
        proposalname = obj.proposalname
        if obj.is_published:
            config = serialized_delete_ikeproposal(proposalname)
            success, result = push_junos_config(
                device.ip_address,
                device.username,
                device.password,
                config
            )
            if not success:
                return Response(
                    {"detail": "Failed to delete proposal from device", "error": result},
                    status=400
                )

        # Proceed to delete from DB
        return super().delete(request, *args, **kwargs)

ikeproposal_delete_view = IkeProposalDestroyView.as_view()

class IkeProposalListNames(APIView):
    def get(self, request):
        device_name = request.query_params.get("device")
        if device_name:
            try:
                device = Device.objects.get(device_name=device_name)
                names = IkeProposal.objects.filter(device=device).values_list('proposalname', flat=True)
            except Device.DoesNotExist:
                return Response({"error": "Device not found"}, status=status.HTTP_404_NOT_FOUND)
        else:
            names = IkeProposal.objects.values_list('proposalname', flat=True)
        return Response(names)
ikeproposal_names_view = IkeProposalListNames.as_view()
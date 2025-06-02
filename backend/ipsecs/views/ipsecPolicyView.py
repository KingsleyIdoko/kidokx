from django.shortcuts import render
from ipsecs.models import IpsecPolicy, IpsecPolicy
from inventories.models import Device
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import render
from rest_framework.generics import ListAPIView, CreateAPIView, DestroyAPIView, UpdateAPIView, RetrieveAPIView
from ipsecs.models import IpsecPolicy
from ipsecs.serializers.ipsecPolicySerializers import IpsecPolicySerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from ipsecs.scripts.ipsecpolicy.getipsecpolicies import get_ipsecpolicies,normalized_policies
from ipsecs.scripts.ipsecpolicy.serialized_data import format_set,push_junos_config,generate_delete_policy

class IkeProposalListView(ListAPIView):
    serializer_class = IpsecPolicySerializer
    def get_queryset(self):
        device_value = self.request.query_params.get('device')
        if device_value:
            try:
                device = Device.objects.get(device_name=device_value)
                return IpsecPolicy.objects.filter(device=device)
            except Device.DoesNotExist:
                return IpsecPolicy.objects.none()
        return IpsecPolicy.objects.none()
    
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

        raw_device_data = get_ipsecpolicies(
            device.ip_address,
            device.username,
            device.password
        )
        if not raw_device_data:
            return Response(db_serialized_data)

        normalized_data = [
        normalized_policies(ipsec_prop)
        for ipsec_prop in raw_device_data
        if isinstance(normalized_policies(ipsec_prop), dict)]
        db_names = [db_proposal['policy_name'] for db_proposal in db_serialized_data]
        device_names = [device_proposal['policy_name'] for device_proposal in normalized_data]
        missing_names = set(device_names) - set(db_names)
        missing_proposals = [p for p in normalized_data if p['policy_name'] in missing_names]
        required_fields = ['policy_name', 'ike_proposal', 'pfs_group']
        created_proposals_list = []
        for p in missing_proposals:
            if any(p.get(field) in [None, ''] for field in required_fields):
                print(f"Skipping invalid proposal: {p['policy_name']} (missing required fields)")
                continue
            serializer = IpsecPolicySerializer(data={**p, 'device': device.device_name})
            if serializer.is_valid():
                serializer.save()
                created_proposals_list.append(p['policy_name'])
            else:
                print("Serializer errors:", serializer.errors)

        final_query = IpsecPolicy.objects.filter(device=device.id)
        serialized_data = self.get_serializer(final_query, many=True).data
        return Response(serialized_data)

ipsecpolicy_list_view = IkeProposalListView.as_view()

class IkeProposalCreateView(CreateAPIView):
    queryset = IpsecPolicy.objects.all()
    serializer_class = IpsecPolicySerializer

ipsecpolicy_create_view = IkeProposalCreateView.as_view()

class IkeProposalDetailView(RetrieveAPIView):
    queryset = IpsecPolicy.objects.all()
    serializer_class = IpsecPolicySerializer
    lookup_field = 'pk'

ipsecpolicy_detail_view = IkeProposalDetailView.as_view()

class IkeProposalUpdateView(UpdateAPIView):  
    queryset = IpsecPolicy.objects.all()
    serializer_class = IpsecPolicySerializer
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
        policy_name = request.data.get('policy_name')
        if not policy_name:
            return Response({"error": "Proposal name is required"}, status=status.HTTP_400_BAD_REQUEST)

        if IpsecProposal.objects.filter(policy_name=policy_name).exclude(pk=obj.pk).exists():
            return Response({"error": "Proposal name must be unique. This name already exists."}, status=status.HTTP_400_BAD_REQUEST)

        # Validate the data but do not save yet
        serializer = self.get_serializer(obj, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)

        # If config must be pushed, do it before saving
        if request.data.get('is_sendtodevice'):
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
    
ipsecpolicy_update_view = IkeProposalUpdateView.as_view()

class IkeProposalDestroyView(DestroyAPIView):
    queryset = IpsecPolicy.objects.all()
    serializer_class = IpsecPolicySerializer
    lookup_field = 'pk'

ipsecpolicy_delete_view = IkeProposalDestroyView.as_view()

class IpsecPollicyNamesView(APIView):
    def get(self, request):
        ipsecpolicynames = IpsecPolicy.objects.values_list('policy_name', flat=True)
        return Response(ipsecpolicynames )  
ipsecpolicy_names_view = IpsecPollicyNamesView.as_view()
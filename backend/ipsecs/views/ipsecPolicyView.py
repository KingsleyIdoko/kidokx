from django.shortcuts import render
from ipsecs.models import IpsecPolicy, IpsecProposal
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
from ipsecs.scripts.ipsecpolicy.serialized_data import format_set,push_junos_config,generate_delete_ipsecPolicy

class IpsecPolicyListView(ListAPIView):
    serializer_class = IpsecPolicySerializer

    def get_device(self, device_value):
        try:
            return Device.objects.get(device_name=device_value)
        except Device.DoesNotExist:
            return None

    def get_queryset(self):
        device_value = self.request.query_params.get('device')
        device = self.get_device(device_value)
        return IpsecPolicy.objects.filter(device=device) if device else IpsecPolicy.objects.none()

    def list(self, request, *args, **kwargs):
        device_value = request.query_params.get('device')
        if not device_value:
            return Response({"error": "Device not found"}, status=status.HTTP_404_NOT_FOUND)

        device = self.get_device(device_value)
        if not device:
            return Response({"error": "Device not found"}, status=status.HTTP_404_NOT_FOUND)

        queryset = self.get_queryset()
        db_serialized_data = self.get_serializer(queryset, many=True).data
        if device.status != "up":
            return Response(
                {"error": f"Device status is '{device.status}'. Config push is only allowed when device is up."},
                status=status.HTTP_400_BAD_REQUEST
            )
        raw_device_data = get_ipsecpolicies(device.ip_address, device.username, device.password)
        if not raw_device_data:
            return Response(db_serialized_data)

        normalized_data = []
        for ipsec_prop in raw_device_data:
            normalized = normalized_policies(ipsec_prop)
            if isinstance(normalized, dict):
                normalized_data.append(normalized)

        db_names = [db_policy['policy_name'] for db_policy in db_serialized_data]
        device_names = [device_policy['policy_name'] for device_policy in normalized_data]
        missing_names = set(device_names) - set(db_names)
        missing_policies = [p for p in normalized_data if p['policy_name'] in missing_names]
        required_fields = ['policy_name', 'ipsec_proposal', 'pfs_group']
        created_proposals_list = []
        for p in missing_policies:
            if any(p.get(field) in [None, ''] for field in required_fields):
                print(f"Skipping invalid policy: {p['policy_name']} (missing required fields)")
                continue

            proposal_name = p.get('ipsec_proposal', '').strip()
            ipsec_obj = IpsecProposal.objects.filter(proposalname__iexact=proposal_name).first()
            if not ipsec_obj:
                print(f"Skipping {p['policy_name']} - ipsec_proposal '{proposal_name}' not found in DB")
                continue

            p['ipsec_proposal'] = ipsec_obj.proposalname

            serializer = IpsecPolicySerializer(data={**p, 'device': device.device_name})
            if serializer.is_valid():
                serializer.save()
                created_proposals_list.append(p['policy_name'])
            else:
                print("Serializer errors:", serializer.errors)

        final_query = IpsecPolicy.objects.filter(device=device.id)
        serialized_data = self.get_serializer(final_query, many=True).data
        return Response(serialized_data)

ipsecpolicy_list_view = IpsecPolicyListView.as_view()

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

        if IpsecPolicy.objects.filter(policy_name=policy_name).exclude(pk=obj.pk).exists():
            return Response({"error": "Proposal name must be unique. This name already exists."}, status=status.HTTP_400_BAD_REQUEST)

        # Validate the data but do not save yet
        serializer = self.get_serializer(obj, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)

        if request.data.get('is_sendtodevice'):
            if device.status != "up":
                return Response(
                    {"error": f"Device status is '{device.status}'. Config push is only allowed when device is up."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            config = format_set(request.data)
            print(config)
            success, result = push_junos_config(
                device.ip_address,
                device.username,
                device.password,
                config,
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

    def delete(self, request, *args, **kwargs):
        obj = self.get_object()  
        device = obj.device
        policy_name = obj.policy_name
        is_published = request.data.get("is_published", False)
        if is_published:
            config = generate_delete_ipsecPolicy(policy_name)
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

ipsecpolicy_delete_view = IkeProposalDestroyView.as_view()

class IpsecPolicyNamesView(APIView):
    def get(self, request):
        device = request.query_params.get("device")
        obj = Device.objects.get(device_name=device)
        if not device:
            return Response({"error": "Missing 'device' query parameter"}, status=400)
        ipsecpolicynames = IpsecPolicy.objects.filter(device=obj.id).values_list('policy_name', flat=True)
        return Response(ipsecpolicynames)

ipsecpolicy_names_view = IpsecPolicyNamesView.as_view()
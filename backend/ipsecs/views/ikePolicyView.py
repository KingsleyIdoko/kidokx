
from django.shortcuts import render
from rest_framework.generics import ListAPIView, CreateAPIView, DestroyAPIView, UpdateAPIView, RetrieveAPIView
from ipsecs.models import IkePolicy, IkeProposal
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from inventories.models import Device
from ipsecs.serializers.ikePolicySerializers import IkePolicySerializer
from ipsecs.scripts.utilities.push_config import push_junos_config
from ipsecs.scripts.ikepolicy.getpolicies import get_junos_ike_policies, normalize_device_policies
from ipsecs.scripts.ikepolicy.serialized_data import serialized_ikepolicy,serialized_delete_ikepolicy
import traceback


class IkePolicyListView(ListAPIView):
    queryset = IkePolicy.objects.all()
    serializer_class = IkePolicySerializer

    def get_queryset(self):
        device_name = self.request.query_params.get("device")
        if device_name:
            try:
                device = Device.objects.get(device_name=device_name)
                return IkePolicy.objects.filter(device=device)
            except Device.DoesNotExist:
                return IkePolicy.objects.none()
        return IkePolicy.objects.none()

class IkePolicyListView(ListAPIView):
    serializer_class = IkePolicySerializer
    def get_queryset(self):
        device_name = self.request.query_params.get("device")
        if device_name:
            try:
                device = Device.objects.get(device_name=device_name)
                return IkePolicy.objects.filter(device=device)
            except Device.DoesNotExist:
                return IkePolicy.objects.none()
        return IkePolicy.objects.none()

    def list(self, request, *args, **kwargs):
        device_name = request.query_params.get("device")
        if not device_name:
            return Response({"error": "Device is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            device = Device.objects.get(device_name=device_name)
        except Device.DoesNotExist:
            return Response({"error": "Device not found"}, status=status.HTTP_404_NOT_FOUND)

        queryset = self.get_queryset()
        db_serialized = self.get_serializer(queryset, many=True).data

        try:
            raw_device_data = get_junos_ike_policies(
                host=device.ip_address,
                username=device.username,
                password=device.password
            )
            if not raw_device_data:

                return Response(db_serialized)
        except Exception:
            return Response(db_serialized)
        normalized_policies = [normalize_device_policies(p) for p in raw_device_data]
        db_names = {item["policyname"] for item in db_serialized}
        device_names = {p["policyname"] for p in normalized_policies}
        validated_db_names = [item for item in db_names if item not in device_names]
        if validated_db_names:
            updated_policies = IkePolicy.objects.filter(policyname__in=validated_db_names, device=device)
            for policy in updated_policies:
                policy.is_published = False
            IkePolicy.objects.bulk_update(updated_policies, ['is_published'])
        missing_names = device_names - db_names
        missing_policies = [p for p in normalized_policies if p["policyname"] in missing_names]
        created = []
        for p in missing_policies:
            proposal_obj = IkeProposal.objects.filter(proposalname=p["proposals"],device=device).first()
            if not proposal_obj:
                print(f"Missing proposal object for '{p['proposals']}' — skipping policy '{p['policyname']}'")
                continue

            serializer = IkePolicySerializer(data={
                "policyname": p["policyname"],
                "device": device.device_name,  # matches slug_field in serializer
                "mode": p["mode"],
                "proposals": proposal_obj.proposalname,  # matches slug_field in serializer
                "pre_shared_key": p["pre_shared_key"],
                "is_published": p["is_published"],
            })
            if serializer.is_valid():
                serializer.save()
                created.append(p["policyname"])
            else:
                print(f"Serializer errors for policy '{p['policyname']}':", serializer.errors)

        final_queryset = IkePolicy.objects.filter(device=device)
        serialized = self.get_serializer(final_queryset, many=True).data
        return Response(serialized)
    
ikepolicy_list_view = IkePolicyListView.as_view()


class IkePolicyCreateView(CreateAPIView):
    queryset = IkePolicy.objects.all()
    serializer_class = IkePolicySerializer
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

    def update(self, request, *args, **kwargs):
        try:
            device = None
            device_value = request.data.get("device")

            if isinstance(device_value, str) and not device_value.isdigit():
                try:
                    device = Device.objects.get(device_name=device_value)
                    request.data["device"] = device.device_name  # keep consistent with serializer
                except Device.DoesNotExist:
                    return Response(
                        {"device": "Device with this name does not exist."},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
            elif str(device_value).isdigit():
                device = Device.objects.filter(id=device_value).first()
                if not device:
                    return Response(
                        {"device": "Device with this ID does not exist."},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
            obj = self.get_object()
            if request.data.get("is_sendtodevice"):
                payload = [
                    request.data.get("policyname"),
                    request.data.get("mode"),
                    request.data.get("proposals"),
                    request.data.get("pre_shared_key"),
                ]
                config = serialized_ikepolicy(payload)
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
ikepolicy_update_view = IkePolicyUpdateView.as_view()

class IkePolicyDestroyView(DestroyAPIView):
    queryset = IkePolicy.objects.all()
    serializer_class = IkePolicySerializer
    lookup_field = 'pk'
    def delete(self, request, *args, **kwargs):
        obj = self.get_object()
        device = obj.device
        policyname = obj.policyname

        if obj.is_published:
            config = serialized_delete_ikepolicy(policyname)
            success, result = push_junos_config(
                device.ip_address,
                device.username,
                device.password,
                config
            )
            if not success:
                return Response(
                    {"detail": "Failed to delete policy from device", "error": result},
                    status=status.HTTP_400_BAD_REQUEST
                )
        return super().delete(request, *args, **kwargs)
ikepolicy_delete_view = IkePolicyDestroyView.as_view()


class IkePolicyListNames(APIView):
    def get(self, request):
        device_name = request.query_params.get("device")

        if not device_name:
            return Response({"error": "Device name is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            device_id = Device.objects.get(device_name=device_name).id
        except Device.DoesNotExist:
            return Response({"error": "Device not found"}, status=status.HTTP_404_NOT_FOUND)

        queryset = IkePolicy.objects.filter(device=device_id).values_list("policyname", flat=True)
        return Response(queryset)

ikepolicy_names_view = IkePolicyListNames.as_view()
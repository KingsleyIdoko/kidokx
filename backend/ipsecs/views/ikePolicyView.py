
from django.shortcuts import render
from rest_framework.generics import ListAPIView, CreateAPIView, DestroyAPIView, UpdateAPIView, RetrieveAPIView
from ipsecs.models import IkePolicy
from rest_framework.views import APIView
from rest_framework.response import Response
from inventories.models import Device
from ipsecs.serializers.ikePolicySerializers import IkePolicySerializer

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

    def list(self, request, *args, **kwargs):
        device_name = request.query_params.get("device")
        if not device_name:
            return Response({"error": "Device is required"}, status=400)
        try:
            device = Device.objects.get(device_name=device_name)
        except Device.DoesNotExist:
            return Response({"error": "Device not found"}, status=404)

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

        normalized_policies = [normalize_device_policy(p) for p in raw_device_data]
        db_names = {item["policyname"] for item in db_serialized}
        device_names = {p["policyname"] for p in normalized_policies}
        missing_names = device_names - db_names
        missing_policies = [p for p in normalized_policies if p["policyname"] in missing_names]

        created = []
        for p in missing_policies:
            serializer = IkePolicySerializer(data={**p, "device": device.id})
            if serializer.is_valid():
                serializer.save()
                created.append(p["policyname"])
            else:
                print("Serializer errors:", serializer.errors)

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
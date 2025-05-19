from rest_framework import serializers
from ipsecs.models import IkePolicy, IkeProposal
from inventories.models import Device

class IkePolicySerializer(serializers.ModelSerializer):
    device = serializers.SlugRelatedField(slug_field='device_name',queryset=Device.objects.all())
    proposals = serializers.SlugRelatedField(slug_field='proposalname',queryset=IkeProposal.objects.none()  )

    class Meta:
        model = IkePolicy
        fields = [
            'id',
            'policyname',
            'device',
            'mode',
            'proposals',
            'pre_shared_key',
            'is_published',
        ]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        # Avoid custom logic when serializer is used for output (no initial_data)
        if not hasattr(self, "initial_data"):
            return

        if isinstance(self.initial_data, list):
            return  # skip for bulk creation

        device_name = (
            self.initial_data.get("device")
            if isinstance(self.initial_data, dict)
            else getattr(getattr(self.instance, "device", None), "device_name", None)
        )

        if device_name:
            device = Device.objects.filter(device_name=device_name).first()
            if device:
                self.fields["proposals"].queryset = IkeProposal.objects.filter(device=device)


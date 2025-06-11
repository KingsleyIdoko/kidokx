from rest_framework import serializers
from ipsecs.models import IpsecPolicy, IpsecProposal
from inventories.models import Device

class IpsecPolicySerializer(serializers.ModelSerializer):
    device = serializers.SlugRelatedField(slug_field='device_name', queryset=Device.objects.all())
    ipsec_proposal = serializers.SlugRelatedField(slug_field='proposalname', queryset=IpsecProposal.objects.none())

    class Meta:
        model = IpsecPolicy
        fields = [
            'id',
            'policy_name',
            'description',
            'device',
            'pfs_group',
            'ipsec_proposal',
            'is_published',
        ]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        if not hasattr(self, "initial_data"):
            return

        if isinstance(self.initial_data, list):
            return  # skip bulk create

        device_name = (
            self.initial_data.get("device")
            if isinstance(self.initial_data, dict)
            else getattr(getattr(self.instance, "device", None), "device_name", None)
        )

        if device_name:
            device = Device.objects.filter(device_name=device_name).first()
            if device:
                self.fields["ipsec_proposal"].queryset = IpsecProposal.objects.filter(device=device)

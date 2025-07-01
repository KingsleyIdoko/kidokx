from rest_framework import serializers
from ipsecs.models import IpsecProposal
from inventories.models import Device

class IpsecProposalSerializer(serializers.ModelSerializer):
    device = serializers.SlugRelatedField(slug_field='device_name', queryset=Device.objects.all())
    in_use = serializers.SerializerMethodField()

    class Meta:
        model = IpsecProposal
        fields = [
            'id',  
            'proposalname',
            'device',  
            'authentication_algorithm',
            'encryption_algorithm',
            'encapsulation_protocol',
            'lifetime_seconds',
            'is_published',
            'in_use',
        ]

        read_only_fields = ['in_use'] 

        extra_kwargs = {
            'authentication_algorithm':{'required':False, 'allow_null':True}
        }

    def get_in_use(self, obj):
            return obj.ipsec_policies_for_proposal.exists()
    
    def validate_proposalname(self, value):
        device = self.initial_data.get('device')
        if self.instance and self.instance.proposalname == value:
            return value
        if isinstance(device, str) and not device.isdigit():
            try:
                device = Device.objects.get(device_name=device).id
            except Device.DoesNotExist:
                raise serializers.ValidationError("Invalid referenced Device")
        queryset = IpsecProposal.objects.filter(proposalname=value, device=device)
        if self.instance:
            queryset = queryset.exclude(pk=self.instance.id)
        if queryset.exists():
            raise serializers.ValidationError("Policyname already exist")
        return value
    
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
      
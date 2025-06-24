from rest_framework import serializers
from ipsecs.models import IkeProposal
from inventories.models import Device


class IkeProposalSerializer(serializers.ModelSerializer):
    device = serializers.PrimaryKeyRelatedField(queryset=Device.objects.all(), write_only=True)
    device_name = serializers.SlugRelatedField(read_only=True, slug_field='device_name', source='device')
    in_use = serializers.SerializerMethodField()

    class Meta:
        model = IkeProposal
        fields = [
            'id',
            'proposalname',
            'device',         # used on write
            'device_name',    # returned on read
            'authentication_algorithm',
            'authentication_method',
            'encryption_algorithm',
            'dh_group',
            'lifetime_seconds',
            'is_published',
            'in_use',
        ]

        read_only_fields = ['in_use'] 

        extra_kwargs = {
            'authentication_algorithm': {'required': False, 'allow_null': True}
        }

    def get_in_use(self, obj):
        return obj.ike_policies.exists()
    
    
    def validate_proposalname(self, value):
        device = self.initial_data.get("device")
        # Skip check if this is an update and the name hasn't changed
        if self.instance and self.instance.proposalname == value:
            return value
        # If the device is coming as a name, resolve its ID
        if isinstance(device, str) and not device.isdigit():
            try:
                device = Device.objects.get(device_name=device).id
            except Device.DoesNotExist:
                raise serializers.ValidationError("Invalid device reference.")

        queryset = IkeProposal.objects.filter(proposalname=value, device=device)

        if self.instance:
            queryset = queryset.exclude(pk=self.instance.pk)

        if queryset.exists():
            raise serializers.ValidationError("Proposal name already exists for this device.")
        
        return value
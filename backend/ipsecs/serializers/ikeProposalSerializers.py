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

    def validate(self, data):
        instance = IkeProposal(**data)
        instance.clean()  
        return data
    
    def validate_proposalname(self, value):
        if self.instance:
            # Editing: exclude current instance from uniqueness check
            if IkeProposal.objects.exclude(pk=self.instance.pk).filter(proposalname=value).exists():
                raise serializers.ValidationError("Proposal name already exists.")
        else:
            # Creating
            if IkeProposal.objects.filter(proposalname=value).exists():
                raise serializers.ValidationError("Proposal name already exists.")
        return value
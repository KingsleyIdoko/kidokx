from rest_framework import serializers
from ipsecs.models import IkeProposal
from inventories.models import Device


class IkeProposalSerializer(serializers.ModelSerializer):
    device = serializers.PrimaryKeyRelatedField(queryset=Device.objects.all(), write_only=True)
    device_name = serializers.SlugRelatedField(read_only=True, slug_field='device_name', source='device')

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
        ]
        extra_kwargs = {
            'authentication_algorithm': {'required': False, 'allow_null': True}
        }

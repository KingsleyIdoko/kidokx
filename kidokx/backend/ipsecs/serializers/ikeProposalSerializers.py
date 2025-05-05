from rest_framework import serializers
from ipsecs.models import IkeProposal
from inventories.models import Device
class IkeProposalSerializer(serializers.ModelSerializer):
    device = serializers.SlugRelatedField(slug_field='device_name', queryset=Device.objects.all())
    class Meta:
        model = IkeProposal
        fields = [
            'id',
            'proposalname',
            'device',
            'authentication_algorithm',
            'authentication_method',
            'encryption_algorithm',
            'dh_group',
            'lifetime_seconds',
            'is_published',
        ]

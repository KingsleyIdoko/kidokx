from rest_framework import serializers
from ipsecs.models import IkeProposal
from inventories.models import Device
class IkeProposalSerializer(serializers.ModelSerializer):
    device = serializers.SlugRelatedField(slug_field='name', queryset=Device.objects.all())
    class Meta:
        model = IkeProposal
        fields = [
            'id',
            'proposalname',
            'device',
            'authentication_algorithm',
            'encryption_algorithm',
            'dh_group',
            'lifetime_seconds',
        ]

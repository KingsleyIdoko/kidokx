from rest_framework import serializers
from ipsecs.models import IkeProposal
from inventories.models import Device
class IkeProposalSerializer(serializers.ModelSerializer):
    device_name = serializers.ReadOnlyField(source='device.name')
    device = serializers.PrimaryKeyRelatedField(queryset=Device.objects.all())

    class Meta:
        model = IkeProposal
        fields = [
            'proposalname',
            'device_name',
            'device',  # use 'device' instead of 'device_id'
            'authentication_algorithm',
            'encryption_algorithm',
            'dh_group',
            'lifetime_seconds',
        ]

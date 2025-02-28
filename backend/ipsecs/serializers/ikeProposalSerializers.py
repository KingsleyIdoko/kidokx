from rest_framework import serializers
from ipsecs.models import IkeProposal

class IkeProposalSerializer(serializers.ModelSerializer):
    device_name = serializers.ReadOnlyField(source='device.name') 
    class Meta:
        model = IkeProposal
        fields = [
            'name',
            'device_name',
            'authentication_algorithm',
            'encryption_algorithm',
            'dh_group',
            'lifetime_seconds',
            'lifetime_kilobytes',
        ]


from rest_framework import serializers
from .models import IkeProposal

class IkeProposalSerializer(serializers.ModelSerializer):
    get_device = serializers.ReadOnlyField()  
    class Meta:
        model = IkeProposal
        fields = [
            'name',
            'get_device',
            'protocol',
            'authentication_algorithm',
            'encryption_algorithm',
            'dh_group',
            'lifetime_seconds',
            'lifetime_kilobytes',
        ]


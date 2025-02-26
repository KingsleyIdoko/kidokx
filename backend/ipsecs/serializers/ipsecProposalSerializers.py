from rest_framework import serializers
from ipsecs.models import IpsecProposal

class IpsecProposalSerializer(serializers.ModelSerializer):
    device_name = serializers.ReadOnlyField(source='device.name')  # Assuming Device has a name field

    class Meta:
        model = IpsecProposal
        fields = [
            'id',  
            'name',
            'device',  # ForeignKey (needed for updates)
            'device_name',  # Read-only field for device name
            'authentication_algorithm',
            'encryption_algorithm',
            'lifetime_seconds',
        ]

from rest_framework import serializers
from ipsecs.models import IpsecProposal
from inventories.models import Device

class IpsecProposalSerializer(serializers.ModelSerializer):
    device = serializers.SlugRelatedField(slug_field='name', queryset=Device.objects.all())

    class Meta:
        model = IpsecProposal
        fields = [
            'id',  
            'proposal_name',
            'device',  
            'authentication_algorithm',
            'encryption_algorithm',
            'encapsulation_protocol',
        ]

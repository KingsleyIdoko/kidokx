from rest_framework import serializers
from ipsecs.models import IkePolicy, IkeProposal
from inventories.models import Device

class IkePolicySerializer(serializers.ModelSerializer):
    device = serializers.SlugRelatedField(slug_field='device_name', queryset=Device.objects.all())
    proposals = serializers.SlugRelatedField(slug_field='proposalname', queryset=IkeProposal.objects.all(), many=False)
    class Meta:
        model = IkePolicy
        fields = [
            'id',  
            'policyname',
            'device', 
            'mode',
            'proposals',
            'authentication_method',
            'pre_shared_key',
            'is_published',
        ]

    



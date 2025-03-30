from rest_framework import serializers
from ipsecs.models import IkeGateway, IkePolicy
from inventories.models import Device

class IkeGatewaySerializer(serializers.ModelSerializer):
    device = serializers.SlugRelatedField(slug_field='name', queryset=Device.objects.all())
    policies = serializers.SlugRelatedField(slug_field='name', queryset=IkePolicy.objects.all(), many=True)


    class Meta:
        model = IkeGateway
        fields = [
            'id',  
            'name',
            'device',  
            'policies',
            'remote_address',
            'local_interface',
            'external_interface',
        ]


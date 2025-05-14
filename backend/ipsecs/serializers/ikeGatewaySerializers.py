from rest_framework import serializers
from ipsecs.models import IkeGateway, IkePolicy
from inventories.models import Device

class IkeGatewaySerializer(serializers.ModelSerializer):
    device = serializers.SlugRelatedField(slug_field='device_name', queryset=Device.objects.all())
    ike_policy = serializers.SlugRelatedField(slug_field='policyname', queryset=IkePolicy.objects.all())

    class Meta:
        model = IkeGateway
        fields = [
            'id',
            'gatewayname',
            'device',
            'remote_address',
            'ike_version',
            'local_address',
            'external_interface',
            'ike_policy',
            'is_published',
        ]
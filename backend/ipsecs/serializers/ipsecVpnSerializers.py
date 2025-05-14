from rest_framework import serializers
from ipsecs.models import IpsecVpn, IpsecPolicy, IkeGateway
from inventories.models import Device

class IpsecVpnSerializer(serializers.ModelSerializer):
    device = serializers.SlugRelatedField(slug_field='device_name', queryset=Device.objects.all())
    ike_gateway = serializers.SlugRelatedField(slug_field='gatewayname', queryset=IkeGateway.objects.all())
    ipsec_policy = serializers.SlugRelatedField(slug_field='policy_name', queryset=IpsecPolicy.objects.all())

    class Meta:
        model = IpsecVpn
        fields = [
            'id',
            'vpn_name',
            'device',
            'ike_gateway',
            'ipsec_policy',
            'bind_interface',
            'establish_tunnel',
            'is_published',
        ]


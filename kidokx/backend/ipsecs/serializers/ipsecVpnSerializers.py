from rest_framework import serializers
from ipsecs.models import IpsecVpn

class IpsecVpnSerializer(serializers.ModelSerializer):
    device_name = serializers.ReadOnlyField(source='device.name')  # Assuming Device has a name field
    ike_gateway_name = serializers.ReadOnlyField(source='ike_gateway.name')  # Assuming IkeGateway has a name field
    ipsec_policy_name = serializers.ReadOnlyField(source='ipsec_policy.name')  # Assuming IpsecPolicy has a name field

    class Meta:
        model = IpsecVpn
        fields = [
            'id',
            'name',
            'device',  # ForeignKey (needed for updates)
            'device_name',  # Read-only field for device name
            'ike_gateway',  # ForeignKey (needed for updates)
            'ike_gateway_name',  # Read-only field for gateway name
            'ipsec_policy',  # ForeignKey (needed for updates)
            'ipsec_policy_name',  # Read-only field for policy name
            'bind_interface',
        ]

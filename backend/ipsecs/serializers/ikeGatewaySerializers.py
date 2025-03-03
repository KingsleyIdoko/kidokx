from rest_framework import serializers
from ipsecs.models import IkeGateway, IkePolicy

class IkeGatewaySerializer(serializers.ModelSerializer):
    device_name = serializers.ReadOnlyField(source='device.name')  
    ike_policy_name = serializers.ReadOnlyField(source='ike_policy.name') 

    class Meta:
        model = IkeGateway
        fields = [
            'id',  
            'name',
            'device',  
            'device_name',  
            'remote_address',
            'local_interface',
            'ike_policy_name',  
            'external_interface',
        ]

from rest_framework import serializers
from ipsecs.models import IkePolicy

class IkePolicySerializer(serializers.ModelSerializer):
    get_device = serializers.ReadOnlyField(source='device.name')  
    proposals = serializers.PrimaryKeyRelatedField(many=True, queryset=IkePolicy.objects.all()) 
    
    class Meta:
        model = IkePolicy
        fields = [
            'id',  
            'name',
            'get_device',  
            'device', 
            'proposals',  
            'authentication_method',
            'pre_shared_key',
        ]



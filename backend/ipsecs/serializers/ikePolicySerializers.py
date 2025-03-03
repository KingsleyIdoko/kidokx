from rest_framework import serializers
from ipsecs.models import IkePolicy

class IkePolicySerializer(serializers.ModelSerializer):
    get_device = serializers.ReadOnlyField(source='device.name')  
    proposals = serializers.SlugRelatedField(
        many=True, 
        read_only=True, 
        slug_field='name'  # Returns the proposal "name" instead of its ID
    )

    class Meta:
        model = IkePolicy
        fields = [
            'id',  
            'name',
            'get_device',  
            'device', 
            'proposals',  # Returns names instead of IDs
            'authentication_method',
            'pre_shared_key',
        ]

    



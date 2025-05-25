from .models import Interface
from inventories.models import Device
from rest_framework import serializers

class InterfaceSerializer(serializers.ModelSerializer):
    device = serializers.SlugRelatedField(slug_field='device_name', queryset=Device.objects.all())

    class Meta:
        model = Interface
        fields = [
            'device',
            'name',
            'description',
            'ip_address',
            'status',
            'speed',
            'mac_address',
            'interface_type',
        ]

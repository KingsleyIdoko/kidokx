from .models import Address, AddressBook
from rest_framework import serializers
from ipaddress import ip_network
from inventories.models import Device

class AddressSerializers(serializers.ModelSerializer):
    device =  serializers.SlugRelatedField('device_name', queryset=Device.objects.all())

    class Meta:
        model = Address
        fields = [
            'name',
            'ip_prefix',
            'description',
            'device',
            # 'created_at',
            # 'updated_at'
        ]

        read_only_fields = ['created_at','updated_at']

    def validate_ip_address(self, value):
        try:
            net = ip_network(value, strict=False)
        except Exception as exc:
            raise serializers.ValidationError(f"Invalid IP/CIDR: {value} ({exc})")
        # Normalize to canonical network form (e.g. '10.0.0.0/24', '2001:db8::/32')
        return net.with_prefixlen



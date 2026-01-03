# serializers.py
from rest_framework import serializers
from ipaddress import ip_network
from inventories.models import Device
from .models import Address, AddressBook
from security.models import SecurityZone


class AddressSerializer(serializers.ModelSerializer):
    device = serializers.SlugRelatedField(
        slug_field="device_name",
        queryset=Device.objects.all(),
    )

    # show the address-book name (security group)
    addressbook = serializers.CharField(source="addressbook.name", read_only=True)

    # show the zone name via addressbook -> attached_zone
    attached_zone = serializers.CharField(source="addressbook.attached_zone.zone_name", read_only=True)

    class Meta:
        model = Address
        fields = ["id", "name", "ip_prefix", "description", "device", "addressbook", "attached_zone"]
        read_only_fields = ["id"]

    def validate_ip_prefix(self, value):
        try:
            net = ip_network(value, strict=False)
        except Exception as exc:
            raise serializers.ValidationError(f"Invalid IP/CIDR: {value} ({exc})")
        return net.with_prefixlen



class AddressBookSerializer(serializers.ModelSerializer):
    device = serializers.SlugRelatedField(
        slug_field="device_name",
        queryset=Device.objects.all(),
        required=False,
    )

    attached_zone = serializers.SlugRelatedField(
        slug_field="zone_name",
        queryset=SecurityZone.objects.none(),
    )

    addresses = AddressSerializer(many=True, read_only=True)

    class Meta:
        model = AddressBook
        fields = ["id", "name", 'description', "device", "attached_zone", "addresses"]
        read_only_fields = ["id"]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        device = self.context.get("device")
        self.fields["attached_zone"].queryset = (
            SecurityZone.objects.filter(device=device) if device else SecurityZone.objects.all()
        )

    def create(self, validated_data):
        device = self.context.get("device")
        if device and "device" not in validated_data:
            validated_data["device"] = device
        return super().create(validated_data)

    def validate_attached_zone(self, value):
        device = self.context.get("device")
        if device and value.device_id != device.id:
            raise serializers.ValidationError("Zone does not belong to this device.")
        return value




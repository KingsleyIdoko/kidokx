from rest_framework import serializers
from security.models import SecurityZone
from inventories.models import Device

class SecurityZoneSerializer(serializers.ModelSerializer):
    # Represent device as its device_name instead of numeric PK
    device = serializers.SlugRelatedField(
        slug_field='device_name',
        queryset=Device.objects.all()
    )

    class Meta:
        model = SecurityZone
        fields = [
            'id',
            'zone_name',
            'device',
            'description',
            'interfaces',
            'addresses',
            'system_services',
            'system_protocols',
        ]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        # We keep the __init__ minimal here because zone_name is not relational
        if not hasattr(self, "initial_data"):
            return

        if isinstance(self.initial_data, list):
            return  # bulk create case (many=True)

        # If later you add a related field (like interfaces as FK objects)
        # and you only want interfaces for the given device, THIS is where
        # you would dynamically filter that related field's queryset.
        #
        # Example:
        # device_name = self.initial_data.get("device")
        # if device_name and "interfaces" in self.fields:
        #     dev = Device.objects.filter(device_name=device_name).first()
        #     if dev:
        #         self.fields["interfaces"].queryset = Interface.objects.filter(device=dev)
        #
        # For now, no action needed here.
        return

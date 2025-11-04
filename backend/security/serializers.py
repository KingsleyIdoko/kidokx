from rest_framework import serializers
from inventories.models import Device
from interfaces.models import Interface
from security.models import SecurityZone, Address


class SecurityZoneSerializer(serializers.ModelSerializer):
    device = serializers.SlugRelatedField(
        slug_field='device_name',
        queryset=Device.objects.all()
    )

    # For reading (response)
    interface_names = serializers.SerializerMethodField()

    # For writing (incoming POST)
    interfaces = serializers.ListField(
        child=serializers.CharField(),
        required=False,
        write_only=True
    )

    in_use = serializers.SerializerMethodField()

    class Meta:
        model = SecurityZone
        fields = [
            'id',
            'zone_name',
            'device',
            'description',
            'interface_names',  # new readable field
            'interfaces',       # write-only
            'addresses',
            'system_services',
            'system_protocols',
            'in_use',
        ]
        read_only_fields = ['in_use', 'interface_names']

    def get_in_use(self, obj):
        return obj.interfaces.exists()

    def get_interface_names(self, obj):
        """Return a list of interface names for display."""
        return [iface.name for iface in obj.interfaces.all()]

    def validate_zone_name(self, value):
        if isinstance(self.initial_data, list):
            return value

        device_name = self.initial_data.get("device") if isinstance(self.initial_data, dict) else None
        if self.instance and self.instance.zone_name == value:
            return value

        if not device_name:
            raise serializers.ValidationError("Device is required")

        try:
            device = Device.objects.get(device_name=device_name)
        except Device.DoesNotExist:
            raise serializers.ValidationError("Invalid device specified")

        if SecurityZone.objects.filter(zone_name=value, device=device).exclude(
            pk=getattr(self.instance, "pk", None)
        ).exists():
            raise serializers.ValidationError(
                "Zone with this name already exists on this device"
            )
        return value

    def validate_interfaces(self, value):
        normalized_interfaces = []
        device_name = self.initial_data.get("device") if isinstance(self.initial_data, dict) else None
        device = Device.objects.filter(device_name=device_name).first() if device_name else None

        for iface_name in value:
            if iface_name.endswith(".0"):
                iface_name = iface_name[:-2]

            qs = Interface.objects.filter(name=iface_name)
            if device:
                qs = qs.filter(device=device)

            iface_obj = qs.first()
            if not iface_obj:
                raise serializers.ValidationError(
                    f"Interface '{iface_name}' not found for this device."
                )

            existing_zone = (
                SecurityZone.objects.filter(interfaces=iface_obj)
                .exclude(pk=self.instance.pk if self.instance else None)
                .first()
            )
            if existing_zone:
                raise serializers.ValidationError(
                    f"Interface '{iface_obj.name}' already belongs to zone '{existing_zone.zone_name}'."
                )

            normalized_interfaces.append(iface_obj)

        return normalized_interfaces

    def create(self, validated_data):
        """
        Handles both single and bulk creation.
        Manually attach interfaces since we use write_only field.
        """
        # Bulk create case
        if isinstance(validated_data, list):
            zones = []
            for data in validated_data:
                interfaces = data.pop("interfaces", [])
                zone = super(SecurityZoneSerializer, self).create(data)
                if interfaces:
                    zone.interfaces.set(interfaces)
                zones.append(zone)
            return zones 

        # Single create case
        interfaces = validated_data.pop("interfaces", [])
        zone = super().create(validated_data)
        if interfaces:
            zone.interfaces.set(interfaces)
        return zone


    def update(self, instance, validated_data):
        """Handle updates with interfaces write-only field."""
        interfaces = validated_data.pop("interfaces", None)
        zone = super().update(instance, validated_data)
        if interfaces is not None:
            zone.interfaces.set(interfaces)
        return zone

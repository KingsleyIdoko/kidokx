from rest_framework import serializers
from ipsecs.models import IkeGateway, IkePolicy
from inventories.models import Device

class IkeGatewaySerializer(serializers.ModelSerializer):
    device = serializers.SlugRelatedField(slug_field='device_name', queryset=Device.objects.all())
    ike_policy = serializers.SlugRelatedField(slug_field='policyname', queryset=IkePolicy.objects.none())
    in_use = serializers.SerializerMethodField()

    class Meta:
        model = IkeGateway
        fields = [
            'id',
            'gatewayname',
            'device',
            'ike_policy',
            'remote_address',
            'local_address',
            'external_interface',
            'ike_version',
            'is_published',
            'in_use',
        ]

    read_only_fields = ['in_use'] 

    def get_in_use(self, obj):
            return obj.ipsec_vpns_for_gateway.exists()
        

    def validate_gatewayname(self, value):
        device = self.initial_data.get('device')
        if self.instance and self.instance.gatewayname == value:
            return value
        if isinstance(device, str) and not device.isdigit():
            try:
                device = Device.objects.get(device_name=device).id
            except Device.DoesNotExist:
                raise serializers.ValidationError("Invalid referenced Device")
        queryset = IkeGateway.objects.filter(gatewayname=value, device=device)
        if self.instance:
            queryset = queryset.exclude(pk=self.instance.pk)
        if queryset.exists():
            raise serializers.ValidationError("gatewayname already exists")
        return value

    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        if not hasattr(self, "initial_data"):
            return

        if isinstance(self.initial_data, list):
            return  # skip bulk create

        device_name = (
            self.initial_data.get("device")
            if isinstance(self.initial_data, dict)
            else getattr(getattr(self.instance, "device", None), "device_name", None)
        )

        if device_name:
            device = Device.objects.filter(device_name=device_name).first()
            if device:
                self.fields["ike_policy"].queryset = IkePolicy.objects.filter(device=device)

from rest_framework import serializers
from ipsecs.models import IpsecVpn, IpsecPolicy, IkeGateway
from inventories.models import Device
from interfaces.models import Interface


class IpsecVpnSerializer(serializers.ModelSerializer):
    device = serializers.SlugRelatedField(slug_field='device_name', queryset=Device.objects.all())
    ike_gateway = serializers.SlugRelatedField(slug_field='gatewayname', queryset=IkeGateway.objects.none())
    ipsec_policy = serializers.SlugRelatedField(slug_field='policy_name', queryset=IpsecPolicy.objects.none())
    bind_interface = serializers.SlugRelatedField(slug_field='name', queryset=Interface.objects.none())

    class Meta:
        model = IpsecVpn
        fields = [
            'id',
            'vpn_name',
            'device',
            'ike_gateway',
            'ipsec_policy',
            'bind_interface',
            'establish_tunnel',
            'is_published',
        ]

    def validate_vpn_name(self, value):
        device_name = self.initial_data.get("device")
        if not device_name and self.instance:
            device_name = getattr(self.instance.device, "device_name", None)
        if not device_name:
            raise serializers.ValidationError("Device is required")

        existing = IpsecVpn.objects.filter(vpn_name=value, device__device_name=device_name)
        if self.instance:
            existing = existing.exclude(pk=self.instance.pk)

        if existing.exists():
            raise serializers.ValidationError("VPN name is already in use")

        return value

    def validate_bind_interface(self, value):
        device_name = self.initial_data.get("device")
        if not device_name:
            if self.instance:
                device_name = getattr(self.instance.device, "device_name", None)
        if not device_name:
            raise serializers.ValidationError("Device is required to validate bind_interface.")
        existing = IpsecVpn.objects.filter(bind_interface=value, device__device_name=device_name)
        if self.instance:
            existing = existing.exclude(pk=self.instance.pk)
        if existing.exists():
            raise serializers.ValidationError("This interface is already used on this device.")
        return value

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        if not hasattr(self, "initial_data") or isinstance(self.initial_data, list):
            return

        device_name = self.initial_data.get("device")
        if device_name:
            device = Device.objects.filter(device_name=device_name).first()
            if device:
                self.fields["ike_gateway"].queryset = IkeGateway.objects.filter(device=device)
                self.fields["ipsec_policy"].queryset = IpsecPolicy.objects.filter(device=device)
                self.fields["bind_interface"].queryset = Interface.objects.filter(device=device)

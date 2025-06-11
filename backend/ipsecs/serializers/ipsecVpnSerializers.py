from rest_framework import serializers
from ipsecs.models import IpsecVpn, IpsecPolicy, IkeGateway
from inventories.models import Device

class IpsecVpnSerializer(serializers.ModelSerializer):
    device = serializers.SlugRelatedField(slug_field='device_name', queryset=Device.objects.all())
    ike_gateway = serializers.SlugRelatedField(slug_field='gatewayname', queryset=IkeGateway.objects.none())
    ipsec_policy = serializers.SlugRelatedField(slug_field='policy_name', queryset=IpsecPolicy.objects.none())

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
                self.fields["ike_gateway"].queryset = IkeGateway.objects.filter(device=device)
                self.fields["ipsec_policy"].queryset = IpsecPolicy.objects.filter(device=device)

from rest_framework import serializers
from ipsecs.models import IpsecPolicy, IkeProposal
from inventories.models import Device

class IpsecPolicySerializer(serializers.ModelSerializer):
    device = serializers.SlugRelatedField(slug_field='device_name', queryset=Device.objects.all())
    ike_proposal = serializers.SlugRelatedField(slug_field='proposalname',queryset=IkeProposal.objects.all()
)

    class Meta:
        model = IpsecPolicy
        fields = [
            'id',
            'policy_name',
            'description',
            'device',
            'pfs_group',
            'ike_proposal',
            'is_published',
        ]

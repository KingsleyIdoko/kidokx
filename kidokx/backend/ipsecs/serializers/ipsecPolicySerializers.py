from rest_framework import serializers
from ipsecs.models import IpsecPolicy, IkeProposal
from inventories.models import Device

class IpsecPolicySerializer(serializers.ModelSerializer):
    device = serializers.SlugRelatedField(slug_field='name', queryset=Device.objects.all())
    ikeproposals = serializers.SlugRelatedField(slug_field='proposalname',queryset=IkeProposal.objects.all()
)

    class Meta:
        model = IpsecPolicy
        fields = [
            'id',
            'policyname',
            'description',
            'device',
            'pfs_group',
            'ikeproposals',
        ]

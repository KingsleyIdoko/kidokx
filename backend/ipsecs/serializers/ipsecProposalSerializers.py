from rest_framework import serializers
from ipsecs.models import IpsecProposal
from inventories.models import Device

class IpsecProposalSerializer(serializers.ModelSerializer):
    device = serializers.SlugRelatedField(slug_field='device_name', queryset=Device.objects.all())
    in_use = serializers.SerializerMethodField()

    class Meta:
        model = IpsecProposal
        fields = [
            'id',  
            'proposalname',
            'device',  
            'authentication_algorithm',
            'encryption_algorithm',
            'encapsulation_protocol',
            'lifetime_seconds',
            'is_published',
            'in_use',
        ]

        read_only_fields = ['in_use'] 

        extra_kwargs = {
            'authentication_algorithm':{'required':False, 'allow_null':True}
        }

    def get_in_use(self, obj):
            return obj.ipsec_policies_for_proposal.exists()
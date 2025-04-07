from rest_framework import serializers
from ipsecs.models import IpsecPolicy

class IpsecPolicySerializer(serializers.ModelSerializer):
    device_name = serializers.ReadOnlyField(source='device.name')  # Assuming Device has a name field
    proposals = serializers.PrimaryKeyRelatedField(many=True, queryset=IpsecPolicy.objects.all())  # Serialize ManyToManyField

    class Meta:
        model = IpsecPolicy
        fields = [
            'id',
            'name',
            'device',  # ForeignKey (needed for updates)
            'device_name',  # Read-only field for device name
            'proposals',  # ManyToManyField (IDs of related proposals)
            'pfs_group',
        ]

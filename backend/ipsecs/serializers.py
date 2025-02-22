from rest_framework import serializers
from .models import IpsecProposal

class IpsecProposalSerializer(serializers.ModelSerializer):
    class Meta:
        model = IpsecProposal
        fields = '__all__'

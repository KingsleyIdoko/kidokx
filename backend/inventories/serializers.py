from rest_framework import serializers
from .models import Device, Site

class InventoriesSerializer(serializers.ModelSerializer):
    site = serializers.SlugRelatedField(slug_field='site_name', queryset=Site.objects.all())
    class Meta:
        model = Device
        fields = '__all__'

class SiteSerializer(serializers.ModelSerializer):

    class Meta:
        model = Site
        fields = '__all__'


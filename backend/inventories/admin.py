from django.contrib import admin
from .models import Device, Site

@admin.register(Device)
class DeviceInventoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'device_name', 'device_type', 'vendor_name', 'ip_address', 'connection_protocol', 'site')
    search_fields = ('device_name', 'vendor_name', 'ip_address','status')
    list_filter = ('device_type', 'vendor_name', 'connection_protocol','status')

@admin.register(Site)
class SiteInventoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'site_name', 'location', 'description')
    search_fields = ('site_name', 'location')
    list_filter = ('location',)


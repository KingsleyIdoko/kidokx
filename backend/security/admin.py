from django.contrib import admin
from .models import SecurityZone

@admin.register(SecurityZone)
class SecurityZoneAdmin(admin.ModelAdmin):
    list_display = ('zone_name', 'interfaces_list', 'addresses_list')
    search_fields = ('zone_name',)
    list_filter = (
        ('interfaces', admin.RelatedOnlyFieldListFilter),
        ('addresses', admin.RelatedOnlyFieldListFilter),
    )

    def interfaces_list(self, obj):
        return ', '.join(map(str, obj.interfaces.all()))
    interfaces_list.short_description = 'Interfaces'

    def addresses_list(self, obj):
        return ', '.join(map(str, obj.addresses.all()))
    addresses_list.short_description = 'Addresses'



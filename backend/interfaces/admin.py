from django.contrib import admin
from .models import Interface

@admin.register(Interface)
class InterfaceAdmin(admin.ModelAdmin):
    list_display = ('id', 'device', 'name', 'ip_address', 'status')
    search_fields = ('name', 'description', 'ip_address')
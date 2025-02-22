from django.contrib import admin
from .models import IpsecProposal

@admin.register(IpsecProposal)
class IpsecProposalAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'protocol', 'authentication_algorithm', 'encryption_algorithm', 'lifetime_seconds', 'lifetime_kilobytes', 'dh_group')
    search_fields = ('name', 'authentication_algorithm', 'encryption_algorithm', 'dh_group')
    list_filter = ('protocol', 'authentication_algorithm', 'encryption_algorithm', 'dh_group')

from django.contrib import admin
from .models import IkeProposal

class IkeProposalAdmin(admin.ModelAdmin):
    list_display = ('id','device', 'name')
    search_fields = ('name', 'authentication_algorithm', 'encryption_algorithm', 'dh_group')
    list_filter = ('protocol', 'authentication_algorithm', 'encryption_algorithm', 'dh_group')

admin.site.register(IkeProposal, IkeProposalAdmin)

from django.contrib import admin
from .models import IkeProposal, IkePolicy, IkeGateway, IpsecProposal, IpsecPolicy, IpsecVpn


@admin.register(IkeProposal)
class IkeProposalAdmin(admin.ModelAdmin):
    list_display = ('name','device','authentication_algorithm','encryption_algorithm','dh_group','lifetime_seconds')
    search_fields = ('name', 'authentication_algorithm', 'encryption_algorithm', 'dh_group')
    list_filter = ('name','device','authentication_algorithm','encryption_algorithm','dh_group','lifetime_seconds')


@admin.register(IkePolicy)
class IkePolicyAdmin(admin.ModelAdmin):
    list_display = ('id', 'device', 'name', 'authentication_method')
    search_fields = ('name', 'authentication_method')
    list_filter = ('authentication_method',)


@admin.register(IkeGateway)
class IkeGatewayAdmin(admin.ModelAdmin):
    list_display = ('id', 'device', 'name', 'remote_address', 'local_interface', 'external_interface')
    search_fields = ('name', 'remote_address', 'local_interface', 'external_interface')


@admin.register(IpsecProposal)
class IpsecProposalAdmin(admin.ModelAdmin):
    list_display = ('id', 'device', 'name', 'authentication_algorithm', 'encryption_algorithm', 'lifetime_seconds')
    search_fields = ('name', 'authentication_algorithm', 'encryption_algorithm')
    list_filter = ('authentication_algorithm', 'encryption_algorithm')


@admin.register(IpsecPolicy)
class IpsecPolicyAdmin(admin.ModelAdmin):
    list_display = ('id', 'device', 'name', 'pfs_group')
    search_fields = ('name',)
    list_filter = ('pfs_group',)


@admin.register(IpsecVpn)
class IpsecVpnAdmin(admin.ModelAdmin):
    list_display = ('id', 'device', 'name', 'ike_gateway', 'ipsec_policy', 'bind_interface')
    search_fields = ('name', 'ike_gateway__name', 'ipsec_policy__name', 'bind_interface')

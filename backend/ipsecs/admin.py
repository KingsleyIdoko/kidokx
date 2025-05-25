from django.contrib import admin
from .models import IkeProposal, IkePolicy, IkeGateway, IpsecProposal, IpsecPolicy, IpsecVpn


@admin.register(IkeProposal)
class IkeProposalAdmin(admin.ModelAdmin):
    list_display = ('proposalname','authentication_algorithm','encryption_algorithm','dh_group')
    search_fields = ('proposalname', 'authentication_algorithm', 'encryption_algorithm', 'dh_group')
    list_filter = ('proposalname','device_id','authentication_algorithm','encryption_algorithm','dh_group','authentication_method')


@admin.register(IkePolicy)
class IkePolicyAdmin(admin.ModelAdmin):
    list_display = ('id', 'device', 'policyname')
    search_fields = ('policyname', 'authentication_method')
    list_filter = ('device',)


@admin.register(IkeGateway)
class IkeGatewayAdmin(admin.ModelAdmin):
    list_display = ('id', 'device', 'gatewayname', 'remote_address', 'local_address', 'external_interface')
    search_fields = ('gatewayname', 'remote_address', 'local_address', 'external_interface')


@admin.register(IpsecProposal)
class IpsecProposalAdmin(admin.ModelAdmin):
    list_display = ('id', 'device', 'proposal_name', 'authentication_algorithm', 'encryption_algorithm')
    search_fields = ('proposal_name', 'authentication_algorithm', 'encryption_algorithm')
    list_filter = ('authentication_algorithm', 'encryption_algorithm')


@admin.register(IpsecPolicy)
class IpsecPolicyAdmin(admin.ModelAdmin):
    list_display = ('id', 'device', 'policy_name', 'pfs_group')
    search_fields = ('policy_name',)
    list_filter = ('pfs_group',)


@admin.register(IpsecVpn)
class IpsecVpnAdmin(admin.ModelAdmin):
    list_display = ('id', 'device', 'vpn_name', 'ike_gateway', 'ipsec_policy', 'bind_interface')
    search_fields = ('name', 'ike_gateway__name', 'ipsec_policy__name', 'bind_interface')

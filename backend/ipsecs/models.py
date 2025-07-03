from django.db import models
from inventories.models import Device
from django.core.exceptions import ValidationError
from interfaces.models import Interface

class ipsecConfiguationItems:
    class dh_group(models.TextChoices):
        GROUP1  = 'group1', 'Group 1'
        GROUP2  = 'group2', 'Group 2'
        GROUP5  = 'group5', 'Group 5'
        GROUP14 = 'group14', 'Group 14'
        GROUP15 = 'group15', 'Group 15'
        GROUP16 = 'group16', 'Group 16'
        GROUP19 = 'group19', 'Group 19'
        GROUP20 = 'group20', 'Group 20'
        GROUP21 = 'group21', 'Group 21'


    class Protocol(models.TextChoices):
        ESP = 'esp', 'esp'
        AH = 'ah', 'ah'

    class IPsecAuthenticationMethod(models.TextChoices):
        MD5 = 'hmac-md5-96'     
        SHA = 'hmac-sha-256-128'
        SHA1 = 'hmac-sha1-96'    

    class Mode(models.TextChoices):
        MAIN = 'main','Main'
        AGGRESSIVE = 'aggressive','Aggressive'

    class AuthAlgorithm(models.TextChoices):
        MD5 = 'md5', 'MD5'
        SHA1 = 'sha1', 'SHA1'
        SHA256 = 'sha-256', 'SHA-256'
        SHA384 = 'sha-384', 'SHA-384'
        SHA512 = 'sha-512', 'SHA-512'

    class EncryptionAlgorithm(models.TextChoices):
        DES3 = '3des-cbc', '3DES-CBC'
        AES_128_CBC = 'aes-128-cbc', 'AES-128-CBC'
        AES_192_CBC = 'aes-192-cbc', 'AES-192-CBC'
        AES_256_CBC = 'aes-256-cbc', 'AES-256-CBC'
        AES_128_GCM = 'aes-128-gcm', 'AES-128-GCM'
        AES_256_GCM = 'aes-256-gcm', 'AES-256-GCM'

    class AuthenticationMethod(models.TextChoices):
        PSK = 'pre-shared-keys', 'Pre-Shared Keys'
        RSA = 'rsa', 'RSA'

    class IkeVersions(models.TextChoices):
        V1_ONLY = "v1-only", "v1-only"
        V2_ONLY = "v2-only", "v2-only"

    class IpsecVpnEstablishTunnel(models.TextChoices):
            immediately = "immediately", "immediately"
            on_traffic = "on-traffic", "on-traffic"


class IkeProposal(models.Model):
    proposalname = models.CharField(max_length=100,verbose_name="IKE Proposal Name")
    device = models.ForeignKey(Device, on_delete=models.PROTECT, related_name='ike_proposals')
    authentication_algorithm = models.CharField(
        max_length=50, choices=ipsecConfiguationItems.AuthAlgorithm.choices , blank=True, null=True
    )
    encryption_algorithm = models.CharField(
        max_length=50, choices=ipsecConfiguationItems.EncryptionAlgorithm.choices
    )
    dh_group = models.CharField(
        max_length=20, choices=ipsecConfiguationItems.dh_group.choices, 
        default=ipsecConfiguationItems.dh_group.GROUP14
    )
    authentication_method = models.CharField(
        max_length=20, choices=ipsecConfiguationItems.AuthenticationMethod.choices,
        default=ipsecConfiguationItems.AuthenticationMethod.PSK
    )
    lifetime_seconds = models.PositiveIntegerField(default=86400)
    is_published  =  models.BooleanField(default=False)
    updated = models.DateTimeField(auto_now=True, null=True, blank=True)  
    timestamp = models.DateTimeField(auto_now_add=True)  

    class Meta:
        ordering = ['-timestamp']
        verbose_name = 'IKE Proposal'
        verbose_name_plural = 'IKE Proposals'



    def __str__(self):
        return self.proposalname


class IkePolicy(models.Model):
    policyname = models.CharField(max_length=100)
    device = models.ForeignKey(Device, on_delete=models.PROTECT, related_name='ike_policies')
    mode = models.CharField(max_length=50, choices=ipsecConfiguationItems.Mode.choices)
    proposals = models.ForeignKey(IkeProposal, on_delete=models.PROTECT,  null=True, blank=True, related_name='ike_policies')
    pre_shared_key = models.CharField(max_length=255, blank=True, null=True)
    is_published = models.BooleanField(default=False)
    updated = models.DateTimeField(auto_now=True, null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-timestamp']
        verbose_name = 'IKE Policy'
        verbose_name_plural = 'IKE Policies'

class IkeGateway(models.Model):
    gatewayname = models.CharField(max_length=100)
    device = models.ForeignKey(Device, on_delete=models.PROTECT, related_name='devices')
    remote_address = models.GenericIPAddressField()
    local_address = models.GenericIPAddressField()
    ike_policy = models.ForeignKey(IkePolicy, on_delete=models.PROTECT,related_name='ike_policies')
    external_interface = models.CharField(max_length=50)
    ike_version = models.CharField(
        max_length=50,
        choices=ipsecConfiguationItems.IkeVersions.choices,
        default=ipsecConfiguationItems.IkeVersions.V1_ONLY
    )
    is_published = models.BooleanField(default=False)
    updated = models.DateTimeField(auto_now=True, null=True, blank=True)  
    timestamp = models.DateTimeField(auto_now_add=True)  

    class Meta:
        ordering = ['-timestamp']
        verbose_name = 'IKE Gateway'
        verbose_name_plural = 'IKE Gateways'

    def clean(self):

        existing = IkeGateway.objects.filter(gatewayname__iexact=self.gatewayname.strip(), device=self.device)
        if self.pk:
            existing.exclude(pk=self.pk)
        if existing:
            raise ValidationError(f"A IkeGateway with the name '{self.gatewayname}' already exists for this device.")
        
    def __str__(self):
        return f"{self.gatewayname}"


class IpsecProposal(models.Model):
    proposalname = models.CharField(max_length=100)
    device = models.ForeignKey(Device, on_delete=models.PROTECT,related_name='ipsec_proposals')
    authentication_algorithm = models.CharField(
        max_length=50, choices=ipsecConfiguationItems.IPsecAuthenticationMethod.choices,
        default=ipsecConfiguationItems.IPsecAuthenticationMethod.SHA, blank=True, null=True
    )
    encryption_algorithm = models.CharField(
        max_length=50, choices=ipsecConfiguationItems.EncryptionAlgorithm.choices
    )
    encapsulation_protocol = models.CharField(
        max_length=50,
        choices=ipsecConfiguationItems.Protocol.choices,
        default=ipsecConfiguationItems.Protocol.ESP
    )
    lifetime_seconds = models.PositiveIntegerField(default=86400)
    is_published = models.BooleanField(default=False)
    updated = models.DateTimeField(auto_now=True, null=True, blank=True)  
    timestamp = models.DateTimeField(auto_now_add=True)  

    class Meta:
        ordering = ['-timestamp']
        verbose_name = 'IPsec Proposal'
        verbose_name_plural = 'IPsec Proposals'


    def __str__(self):
        return self.proposalname


class IpsecPolicy(models.Model):
    policy_name = models.CharField(max_length=100)
    description = models.CharField(max_length=100, blank=True, null=True)
    device = models.ForeignKey(Device, on_delete=models.PROTECT, related_name='ipsec_policies')
    ipsec_proposal = models.ForeignKey(IpsecProposal, on_delete=models.PROTECT, null=True, blank=True, related_name='ipsec_policies_for_proposal')
    pfs_group = models.CharField(
        max_length=20,
        choices=ipsecConfiguationItems.dh_group.choices,
        default=ipsecConfiguationItems.dh_group.GROUP14
    )
    is_published = models.BooleanField(default=False)
    updated = models.DateTimeField(auto_now=True, null=True, blank=True)  
    timestamp = models.DateTimeField(auto_now_add=True)  


    class Meta:
        ordering = ['-timestamp']
        verbose_name = 'IPsec Policy'
        verbose_name_plural = 'IPsec Policies'

    def __str__(self):
        return self.policy_name


class IpsecVpn(models.Model):
    vpn_name = models.CharField(max_length=100)
    device = models.ForeignKey(Device, on_delete=models.PROTECT, related_name='ipsec_vpns')
    ike_gateway = models.ForeignKey(IkeGateway, on_delete=models.PROTECT, related_name='ipsec_vpns_for_gateway')
    ipsec_policy = models.ForeignKey(IpsecPolicy, on_delete=models.PROTECT, related_name='ipsec_vpns_for_policy')
    bind_interface = models.OneToOneField(Interface, on_delete=models.PROTECT, blank=True, null=True)
    establish_tunnel = models.CharField(max_length=50,choices=ipsecConfiguationItems.IpsecVpnEstablishTunnel.choices,
        default=ipsecConfiguationItems.IpsecVpnEstablishTunnel.immediately)
    is_published = models.BooleanField(default=False)
    updated = models.DateTimeField(auto_now=True, null=True, blank=True)  
    timestamp = models.DateTimeField(auto_now_add=True) 

    class Meta:
        ordering = ['-timestamp']
        verbose_name = 'VPN Policy'
        verbose_name_plural = 'VPN Policies'

    def __str__(self):
        return f"{self.vpn_name}"

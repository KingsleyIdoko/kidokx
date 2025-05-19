from django.db import models
from inventories.models import Device
from django.core.exceptions import ValidationError

class ipsecConfiguationItems:
    class dh_group(models.TextChoices):
        GROUP1 = 'group1', 'Group 1'
        GROUP2 = 'group2', 'Group 2'
        GROUP5 = 'group5', 'Group 5'
        GROUP14 = 'group14', 'Group 14'
        GROUP15 = 'group15', 'Group 15'
        GROUP16 = 'group16', 'Group 16'
        GROUP19 = 'group19', 'Group 19'
        GROUP20 = 'group20', 'Group 20'
        GROUP21 = 'group21', 'Group 21'


    class Protocol(models.TextChoices):
        ESP = 'esp', 'ESP'
        AH = 'ah', 'AH'

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
    device = models.ForeignKey(Device, on_delete=models.CASCADE)
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
        ordering = ['proposalname']
        verbose_name = 'IKE Proposal'
        verbose_name_plural = 'IKE Proposals'

    def clean(self):
        if self.lifetime_seconds < 60:
            raise ValidationError("Lifetime must be at least 60 seconds")

    def __str__(self):
        return self.proposalname


class IkePolicy(models.Model):
    policyname = models.CharField(max_length=100, unique=True)
    device = models.ForeignKey(Device, on_delete=models.CASCADE)
    mode = models.CharField(max_length=50, choices=ipsecConfiguationItems.Mode.choices)
    proposals = models.ForeignKey(IkeProposal, on_delete=models.CASCADE, null=True, blank=True)
    pre_shared_key = models.CharField(max_length=255, blank=True, null=True)
    is_published = models.BooleanField(default=False)
    updated = models.DateTimeField(auto_now=True, null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.policyname




class IkeGateway(models.Model):
    gatewayname = models.CharField(max_length=100, unique=True)
    device = models.ForeignKey(Device, on_delete=models.CASCADE)
    remote_address = models.GenericIPAddressField()
    local_address = models.GenericIPAddressField()
    ike_policy = models.ForeignKey(IkePolicy, on_delete=models.CASCADE)
    external_interface = models.CharField(max_length=50, default='g0/0/0')
    ike_version = models.CharField(
        max_length=50,
        choices=ipsecConfiguationItems.IkeVersions.choices,
        default=ipsecConfiguationItems.IkeVersions.V1_ONLY
    )
    is_published = models.BooleanField(default=False)
    updated = models.DateTimeField(auto_now=True, null=True, blank=True)  
    timestamp = models.DateTimeField(auto_now_add=True)  

    def __str__(self):
        return f"{self.gatewayname}"


class IpsecProposal(models.Model):
    proposal_name = models.CharField(max_length=100, unique=True)
    device = models.ForeignKey(Device, on_delete=models.CASCADE)
    authentication_algorithm = models.CharField(
        max_length=50, choices=ipsecConfiguationItems.AuthAlgorithm.choices
    )
    encryption_algorithm = models.CharField(
        max_length=50, choices=ipsecConfiguationItems.EncryptionAlgorithm.choices
    )
    encapsulation_protocol = models.CharField(
        max_length=50,
        choices=ipsecConfiguationItems.Protocol.choices,
        default=ipsecConfiguationItems.Protocol.ESP
    )
    dh_group = models.CharField(
        max_length=20, choices=ipsecConfiguationItems.dh_group.choices,
        default=ipsecConfiguationItems.dh_group.GROUP14
    )
    is_published = models.BooleanField(default=False)
    updated = models.DateTimeField(auto_now=True, null=True, blank=True)  
    timestamp = models.DateTimeField(auto_now_add=True)  

    def __str__(self):
        return self.proposal_name


class IpsecPolicy(models.Model):
    policy_name = models.CharField(max_length=100, unique=True)
    description = models.CharField(max_length=100, blank=True, null=True)
    device = models.ForeignKey(Device, on_delete=models.CASCADE)
    ike_proposal = models.ForeignKey(IkeProposal, on_delete=models.CASCADE, null=True, blank=True)
    pfs_group = models.CharField(
        max_length=20,
        choices=ipsecConfiguationItems.dh_group.choices,
        default=ipsecConfiguationItems.dh_group.GROUP14
    )
    is_published = models.BooleanField(default=False)
    updated = models.DateTimeField(auto_now=True, null=True, blank=True)  
    timestamp = models.DateTimeField(auto_now_add=True)  

    def __str__(self):
        return self.policy_name


class IpsecVpn(models.Model):
    vpn_name = models.CharField(max_length=100, unique=True)
    device = models.ForeignKey(Device, on_delete=models.CASCADE)
    ike_gateway = models.ForeignKey(IkeGateway, on_delete=models.CASCADE)
    ipsec_policy = models.ForeignKey(IpsecPolicy, on_delete=models.CASCADE)
    bind_interface = models.CharField(max_length=50, default='g0/0/0')
    establish_tunnel = models.CharField(
        max_length=50,
        choices=ipsecConfiguationItems.IpsecVpnEstablishTunnel.choices,
        default=ipsecConfiguationItems.IpsecVpnEstablishTunnel.immediately,
    )
    is_published = models.BooleanField(default=False)
    updated = models.DateTimeField(auto_now=True, null=True, blank=True)  
    timestamp = models.DateTimeField(auto_now_add=True)  

    def __str__(self):
        return f"{self.vpn_name}"

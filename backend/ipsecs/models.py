from django.db import models
from inventories.models import Device

class IkeProposal(models.Model):
    PROTOCOL_CHOICES = [
        ('esp', 'ESP'),
        ('ah', 'AH'),
    ]

    AUTH_ALGORITHM_CHOICES = [
        ('md5', 'MD5'),
        ('sha1', 'SHA1'),
        ('sha256', 'SHA256'),
        ('sha384', 'SHA384'),
        ('sha512', 'SHA512'),
    ]

    ENCRYPTION_ALGORITHM_CHOICES = [
        ('3des', '3DES'),
        ('aes-128-cbc', 'AES-128-CBC'),
        ('aes-192-cbc', 'AES-192-CBC'),
        ('aes-256-cbc', 'AES-256-CBC'),
        ('aes-128-gcm', 'AES-128-GCM'),
        ('aes-256-gcm', 'AES-256-GCM'),
    ]

    DH_GROUP_CHOICES = [
        ('group1', 'Group 1'),
        ('group2', 'Group 2'),
        ('group5', 'Group 5'),
        ('group14', 'Group 14'),
        ('group19', 'Group 19'),
        ('group20', 'Group 20'),
    ]

    name = models.CharField(max_length=100, unique=False)
    device = models.ForeignKey(Device, on_delete=models.CASCADE)
    protocol = models.CharField(max_length=10, choices=PROTOCOL_CHOICES, default='esp')
    authentication_algorithm = models.CharField(max_length=50, choices=AUTH_ALGORITHM_CHOICES)
    encryption_algorithm = models.CharField(max_length=50, choices=ENCRYPTION_ALGORITHM_CHOICES)
    dh_group = models.CharField(max_length=20, choices=DH_GROUP_CHOICES)
    lifetime_seconds = models.PositiveIntegerField(default=86400)
    lifetime_kilobytes = models.PositiveIntegerField(default=64000)

    def __str__(self):
        return self.name

    @property
    def get_device(self):
        return self.device.name if self.device else None  

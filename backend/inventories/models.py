from django.db import models
from encrypted_model_fields.fields import EncryptedCharField


DEVICE_TYPES = [
    ('router', 'router'),
    ('switch', 'switch'),
    ('firewall', 'firewall'),
]

VENDOR_TYPES = [
    ('cisco', 'cisco'),
    ('juniper', 'juniper'),
    ('arista', 'arista'),
]

PROTOCOL_CHOICES = [
    ('ssh', 'SSH'),
    ('snmp', 'SNMP'),
    ('telnet', 'Telnet'),
    ('netconf-ssh', 'netconf-ssh'),
]

class Site(models.Model):
    site_name = models.CharField(max_length=50, unique=True)
    location = models.CharField(max_length=50)
    description = models.CharField(max_length=50)  # or use models.TextField() if you want longer input
    updated = models.DateTimeField(auto_now=True, null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.site_name


class Device(models.Model):
    site = models.ForeignKey('Site', on_delete=models.CASCADE)
    device_name = models.CharField(max_length=100, unique=True)
    username = models.CharField(max_length=50)
    password = EncryptedCharField(max_length=100) 
    device_type = models.CharField(max_length=50, choices=DEVICE_TYPES, default='router')
    vendor_name = models.CharField(max_length=50, choices=VENDOR_TYPES, default='cisco')
    intefaces = models
    ip_address = models.GenericIPAddressField()
    device_model = models.CharField(max_length=50, blank=True, null=True)
    connection_protocol = models.CharField(max_length=20, choices=PROTOCOL_CHOICES, default='snmp', blank=True, null=True)
    updated = models.DateTimeField(auto_now=True, null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.device_name


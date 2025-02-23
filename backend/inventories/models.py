from django.db import models
from django.utils.timezone import now

# Define protocol choices
PROTOCOL_CHOICES = [
    ('snmp', 'SNMP'),
    ('https', 'HTTPS API'),
    ('restconf', 'RESTCONF'),
    ('netconf', 'NETCONF')
]

class Device(models.Model):
    device_name = models.CharField(max_length=100)
    device_type = models.CharField(max_length=50)
    vendor_name = models.CharField(max_length=50)
    ip_address = models.GenericIPAddressField(unique=True)  
    conn_protocol = models.CharField(max_length=20, choices=PROTOCOL_CHOICES, default="snmp") 
    updated = models.DateTimeField(auto_now=True, null=True, blank=True)  
    timestamp = models.DateTimeField(auto_now_add=True)  

    def __str__(self):
        return self.device_name

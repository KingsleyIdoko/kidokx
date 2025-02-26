from django.db import models
from django.utils.timezone import now

# Define protocol choices
PROTOCOL_CHOICES = [
    ('snmp', 'SNMP'),
    ('https', 'HTTPS API'),
    ('restconf', 'RESTCONF'),
    ('netconf', 'NETCONF')
]

VENDOR_TYPES = [
    ('cisco', 'Cisco'),
    ('juniper', 'Juniper'),
    ('arista', 'Arista'),
    ('a10', 'A10')
]

DEVICE_TYPES = [
    ('Router', 'Router'),
    ('Switches', 'Switches'),
    ('Firewall', 'Firewall'),
    ('Loadbalancer', 'Loadbalancer'),
]

DEVICE_SCOPE = [  
    ('Core', 'Core'),  
    ('Distribution', 'Distribution'),
    ('Firewall', 'Firewall'),
    ('Access', 'Access'),
]

class Device(models.Model):
    name = models.CharField(max_length=100, unique=True)
    device_type = models.CharField(max_length=50, choices=DEVICE_TYPES, default='Router') 
    vendor_name = models.CharField(max_length=50, choices=VENDOR_TYPES, default='cisco')  
    scope = models.CharField(max_length=50, choices=DEVICE_SCOPE, default='Core')  # Fixed default value  
    ip_address = models.GenericIPAddressField()  
    conn_protocol = models.CharField(max_length=20, choices=PROTOCOL_CHOICES, default="snmp") 
    updated = models.DateTimeField(auto_now=True, null=True, blank=True)  
    timestamp = models.DateTimeField(auto_now_add=True)  

    def __str__(self):
        return self.name

from django.db import models
from inventories.models import Device

from interfaces.models import Interface

class Address(models.Model):
    name = models.CharField(max_length=50)
    cidr = models.CharField(max_length=50)  

    def __str__(self):
        return self.cidr

class SecurityZone(models.Model):
    zone_name = models.CharField(max_length=50)
    description = models.CharField(max_length=80, blank=True, null=True)
    device = device = models.ForeignKey(Device, blank=True, null=True, on_delete=models.PROTECT)
    interfaces = models.ManyToManyField(Interface, blank=True)
    addresses = models.ManyToManyField(Address, blank=True)
    system_services = models.JSONField(default=list)
    system_protocols =  models.JSONField(default=list)
    updated = models.DateTimeField(auto_now=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.zone_name

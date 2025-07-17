from django.db import models

from interfaces.models import Interface

class Address(models.Model):
    name = models.CharField(max_length=50)
    cidr = models.CharField(max_length=50)  

    def __str__(self):
        return self.cidr

class SecurityZone(models.Model):
    zone_name = models.CharField(max_length=50)
    interfaces = models.ManyToManyField(Interface, blank=True)
    addresses = models.ManyToManyField(Address, blank=True)
    system_services = models.JSONField(default=list)
    updated = models.DateTimeField(auto_now=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.zone_name

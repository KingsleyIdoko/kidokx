# security/models.py
from django.db import models
from inventories.models import Device
from interfaces.models import Interface


class SecurityZone(models.Model):
    zone_name = models.CharField(max_length=50)
    description = models.CharField(max_length=80, blank=True, null=True)
    device = models.ForeignKey(Device, on_delete=models.PROTECT, related_name='security_zones')
    interfaces = models.ManyToManyField(Interface, blank=True, related_name='zones')
    system_services = models.JSONField(default=list)
    system_protocols = models.JSONField(default=list)
    updated = models.DateTimeField(auto_now=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('device', 'zone_name')
        ordering = ['zone_name']

    def clean(self):
        existing = SecurityZone.objects.filter(
            zone_name__iexact=self.zone_name.strip(), device=self.device
        )
        if self.pk:
            existing = existing.exclude(pk=self.pk)
        if existing.exists():
            from django.core.exceptions import ValidationError
            raise ValidationError(
                f"A zone named '{self.zone_name}' already exists for this device."
            )

    def __str__(self):
        return f"{self.device.device_name} - {self.zone_name}"

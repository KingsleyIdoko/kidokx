from django.db import models
from django.core.exceptions import ValidationError
import ipaddress
from inventories.models import Device



def validate_cidr(value: str):
    try:
        ipaddress.ip_network(value, strict=True)
    except Exception as exc:
        raise ValidationError(f"Invalid CIDR prefix: {value}. ({exc})")

class Address(models.Model):
    name        = models.CharField(max_length=128)
    device      = models.ForeignKey(Device, on_delete=models.CASCADE, null=True, blank=True)
    ip_prefix   = models.CharField(max_length=64, validators=[validate_cidr])
    description = models.TextField(max_length=100, null=True, blank=True)
    created_at  = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at  = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["name"]
        indexes  = [
            models.Index(fields=["ip_prefix"]),
        ]

    def __str__(self) -> str:
        return f"{self.name} ({self.ip_prefix})"

    @property
    def network(self):
        """Convenience: returns an ipaddress.IPv4Network/IPv6Network object."""
        return ipaddress.ip_network(self.ip_prefix, strict=True)

class AddressBook(models.Model):
    name            = models.CharField(max_length=200, unique=True)
    addresses       = models.ManyToManyField('addresses.Address',blank=True)
    created_at      = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at      = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["name"]

    def __str__(self) -> str:
        return self.name

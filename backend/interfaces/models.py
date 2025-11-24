from django.db import models



class Interface(models.Model):
    device = models.ForeignKey('inventories.Device', related_name='interfaces', on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    description = models.CharField(max_length=255, blank=True, null=True)
    ip_address = models.GenericIPAddressField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=[('up', 'Up'), ('down', 'Down')], blank=True, null=True)
    speed = models.CharField(max_length=20, blank=True, null=True)
    mac_address = models.CharField(max_length=50, blank=True, null=True)
    interface_type = models.CharField(max_length=50, blank=True, null=True)

    def __str__(self):
        return f"{self.device.device_name} - {self.name}"

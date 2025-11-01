from celery import shared_task
from django.utils import timezone
from ..models import Device
from inventories.inventoryview.utils import update_device_status

@shared_task(bind=True,autoretry_for=(Exception,),retry_backoff=True,retry_jitter=True)
def check_device(self,device_id):
  device=Device.objects.get(id=device_id);
  update_device_status(device)

@shared_task
def enqueue_due_device_checks():
 now=timezone.now()
 for d in Device.objects.all():
  if not d.last_checked or (now-d.last_checked).total_seconds()>=d.keepalive:check_device.delay(d.id)

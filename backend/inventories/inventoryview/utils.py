import logging
import subprocess
from celery import shared_task
from ncclient import manager
from ncclient.transport.errors import SSHError, AuthenticationError, SessionCloseError
from inventories.models import Device
from django.utils import timezone

logger = logging.getLogger(__name__)

def ping_device(ip: str, count: int = 2, timeout: int = 1) -> bool:
    try:
        result = subprocess.run(
            ['ping', '-c', str(count), '-W', str(timeout), ip],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )
        return result.returncode == 0
    except Exception as e:
        logger.error(f"Ping error for {ip}: {e}")
        return False

def check_ssh_session(host: str, username: str, password: str, port: int = 830) -> bool:
    try:
        with manager.connect(
            host=host,
            port=port,
            username=username,
            password=password,
            hostkey_verify=False,
            timeout=1,       
            allow_agent=False,
            look_for_keys=False,
        ):
            return True
    except (SSHError, AuthenticationError, SessionCloseError, Exception) as e:
        logger.warning(f"SSH check error for {host}: {e}")
        return False

def determine_status(host: str, username: str, password: str) -> str:
    if not ping_device(host):
        return "down"
    if not check_ssh_session(host, username, password):
        return "unknown"
    return "up"

def update_device_status(device: Device):
    status_before = device.status
    device.status = determine_status(device.ip_address, device.username, device.password)
    device.last_checked = timezone.now()
    device.save(update_fields=['status', 'last_checked'])
    logger.info(
        f"Device '{device.device_name}' status updated from '{status_before}' to '{device.status}'."
    )

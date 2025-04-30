import requests

data = {
    "connection_protocol": "netconf-ssh",
    "device_model": "",
    "device_name": "lon-srx-fw-pry",
    "device_type": "firewall",
    "ip_address": "192.168.1.20",
    "site": "AMS-01",
    "vendor_name": "juniper"
}

endpoint = "http://127.0.0.1:8000/api/inventories/devices/create/"
response = requests.post(endpoint, json=data)

print(response.status_code)
try:
    print(response.json())
except requests.JSONDecodeError:
    print(response.text)


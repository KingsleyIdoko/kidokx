import requests

data = {
    "conn_protocol": "SSH",
    "device_name": "AMS-DC-SRX-FW-01",
    "device_type": "switch",
    "ip_address": "192.168.1.20",
    "site": "AMS-01",
    "vendor_name": "juniper"
}

endpoint = "http://127.0.0.1:8000/api/inventories/device/create/"
response = requests.post(endpoint, json=data)

print(response.status_code)
print(response.json())

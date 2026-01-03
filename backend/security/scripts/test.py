import requests

data = {
    "device": "ams-dc-srx-fw",
    "interfaces": ["ge-0/0/0"],
    "system_protocols": ["all"],
    "system_services": ["all"],
    "zone_name": "new_zone1",
}

URL = "http://127.0.0.1:8000/api/security/zones/create/"
response = requests.post(URL, json=data, timeout=30)

print("Status:", response.status_code)

try:
    print("Response JSON:", response.json())
except ValueError:
    print("Response Text:", response.text)

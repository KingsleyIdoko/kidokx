import requests

data = {
    "encapsulation_protocol": "ESP",
    "encryption_algorithm": "aes-256-cbc",
    "authentication_algorithm": "hmac-sha-256-128",
    "dh_group": "group14",
    "lifetime_seconds": "86400",
    "proposalname": "ipsec-proposal-25",
    "is_published": False,
    "is_sendtodevice": False,
    'device': 'lon-dc-srx-fw',
 }

endpoint = "http://127.0.0.1:8000/api/ipsec/ipsecproposal/create/"
response = requests.post(endpoint, json=data)

print(response.status_code)
print(response.json())
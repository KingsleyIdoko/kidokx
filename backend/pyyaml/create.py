import requests
import json

data = {'name': 'proposal-3', 'protocol': 'esp', 'authentication_algorithm': 'sha256', 'encryption_algorithm': 'aes-128-cbc', 'dh_group': 'group20', 'lifetime_seconds': 86400, 'lifetime_kilobytes': 86400}


endpoint = f"http://localhost:8000/ipsec/proposal/create/"

get_response = requests.post(endpoint, json=data)

print(get_response.json())
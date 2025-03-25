import requests

data = {
    
    "device": "lon-dc-fw-pry",
    "authentication_algorithm": "sha256",
    "encryption_algorithm": "aes-128-cbc",
    "dh_group": "group20",
    "lifetime_seconds": 86400,
    "proposalname": "proposal-7",
}


endpoint = "http://127.0.0.1:8000/api/ipsec/ikeproposal/create/"
response = requests.post(endpoint, json=data)

print(response.status_code)
print(response.json())
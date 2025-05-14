import requests

data = {
    'proposalname': 'proposal-8',
    'authentication_algorithm': 'sha-256',
    'authentication_method': 'pre-shared-keys',
    'dh_group': 'group14',
    'encryption_algorithm': 'aes-128-cbc',
    'lifetime_seconds': 86400,
    'device': 6
}

endpoint = "http://127.0.0.1:8000/api/ipsec/ikeproposal/54/update/"

response = requests.put(endpoint, json=data)

print(response.status_code)
print(response.json())
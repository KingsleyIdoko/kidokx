import requests

data = {

  'proposalname': 'proposal-67',
  'authentication_algorithm': 'sha-256',
  'dh_group': 'group14',
  'encryption_algorithm': 'aes-192-cbc',
  'lifetime_seconds': '86400',
  'device': 'lon-dc-srx-fw',
};
endpoint = "http://127.0.0.1:8000/api/ipsec/ikeproposal/create/"
response = requests.post(endpoint, json=data)

print(response.status_code)
print(response.json())
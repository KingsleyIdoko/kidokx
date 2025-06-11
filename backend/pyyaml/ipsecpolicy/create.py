import requests

data = {
  'policy_name': 'ipsec_policy1DS',
  'ipsecpolicy_description': 'first policySdS',
  'pfs_group': 'group14',
  'ike_proposal': 'ipsec-proposal-2',  # This must match `proposalname`
  'device': 'lon-dc-srx-fw-pry'        # This must match `device_name`
}

endpoint = "http://127.0.0.1:8000/api/ipsec/ipsecpolicy/create/"
response = requests.post(endpoint, json=data)

print(response.status_code)
print(response.json())
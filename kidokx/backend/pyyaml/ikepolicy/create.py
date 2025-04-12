import requests

data = {
  'policyname': 'ikepolicy-5', 
  'device': 'lon-dc-srx-fw', 
  'mode':'main',
  'proposals': 'proposal-1', 
  'authentication_method': 'psk', 
  'pre_shared_key': 'cisco123'
  }

data2  = {
  'authentication_method':"pre-shared-key",
  'device':"lon-dc-srx-fw",
  'ike_mode': "main",
  'policyname':"policy-2",
  'preshared': "cisco123",
  'proposalName': "proposal-1"
}
endpoint = "http://127.0.0.1:8000/api/ipsec/ikepolicy/create/"
response = requests.post(endpoint, json=data)

print(response.status_code)
print(response.json())
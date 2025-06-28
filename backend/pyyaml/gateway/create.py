import requests

data = {
  "device": "lon-dc-srx-fw",
  "external_interface": "reth1",
  "gatewayname": "gateway-3",
  "ike_policy": "ike_policy-1",
  "ike_version": "v2-only",
  "local_address": "192.168.1.10",
  "remote_address": "192.168.1.40"
}



endpoint = "http://127.0.0.1:8000/api/ipsec/ikegateway/create/"
response = requests.post(endpoint, json=data)

print(response.status_code)
print(response.json())
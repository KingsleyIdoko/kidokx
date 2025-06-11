import requests

data = {
    "vpn_name": "ipsecvpn-01",
    "device": "lon-dc-srx-fw-pry",
    "bind_interface": "st0",
    "ipsec_policy": "ipsec-policy-2",
    "ike_gateway": "gateway-2",
    "establish_tunnel": "on-traffic",
}

endpoint = "http://127.0.0.1:8000/api/ipsec/ipsecvpn/create/"
response = requests.post(endpoint, json=data)

print(response.status_code)
print(response.json())

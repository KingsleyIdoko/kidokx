import requests
import json

proposal_id  =  int(input("select proposal_id for details view: "))

data = {'name': 'proposal-1', 'protocol': 'esp', 'authentication_algorithm': 'md5', 'encryption_algorithm': 'aes-256-cbc', 'dh_group': 'group14'}


endpoint = f"http://localhost:8000/ipsec/proposal/{proposal_id}/update/"

get_response = requests.put(endpoint, json=data)

print(get_response.json())
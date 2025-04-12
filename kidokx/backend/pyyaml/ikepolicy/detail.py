import requests
import json

proposal_id  =  int(input("select proposal_id for details view: "))

endpoint = f"http://localhost:8000/ipsec/ikepolicy/{proposal_id}"

get_response = requests.get(endpoint)

print(get_response.json())
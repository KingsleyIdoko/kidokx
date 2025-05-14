import requests
import json

proposal_id  =  int(input("select proposal_id for details view: "))

endpoint = f"http://localhost:8000/ipsec/ikepolicy/{proposal_id}/delete/"

get_response = requests.delete(endpoint)

print(get_response.status_code, get_response.status_code == 204)
import requests
import json


endpoint = "http://localhost:8000/ipsec/proposal/"

get_response = requests.get(endpoint)

print(get_response.json())
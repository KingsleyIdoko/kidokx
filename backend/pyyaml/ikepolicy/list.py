import requests
import json


endpoint = "http://localhost:8000/api/ipsec/ikepolicy/"

get_response = requests.get(endpoint)

print(get_response.json())
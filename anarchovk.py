import requests

token = ""

def auth(my_token):
    global token
    token = my_token

def method(my_method, method_params):
    method_dict = dict({"version": "5.80", "access_token": token}.items() | method_params.items()) 
    method_get = requests.get("https://api.vk.com/method/" + my_method, params=method_dict).json()
    return(method_get)

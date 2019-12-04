# anarchovk Python 2.0
# github.com/dezzev/



import requests


STANDARD_LongPollWait = 25 # Стандартное время ожидания лонгполла
STANDARD_LongPollVersion = 3 # Стандартная версия User Long Poll
STANDARD_LongPollMode = 2 # Доп. опции лонгполла по стандарту
STANDARD_Version = "5.103" # Версия VK Api


def VKError(error_code, error_msg, request_params):
    return Exception("\nVK Error: " + error_msg + "\nError code: " + str(error_code) + "\nRequest params: " + str(request_params))

def method(access_token, method_name, method_params={}, version=STANDARD_Version):
    methodDict = dict({"v": version, "access_token": access_token}.items() | method_params.items())
    response = method_get = requests.get("https://api.vk.com/method/" + method_name, params=methodDict).json()
    if "error" in response:
        raise VKError(response["error"]["error_code"], response["error"]["error_msg"], response["error"]["request_params"])
    else:
        return(response)

def groupLongPoll(access_token, group_id, callback, wait=STANDARD_LongPollWait, version=STANDARD_Version, ts=None): # Bots Long Poll API
    response = method(access_token, "groups.getLongPollServer", {"group_id": group_id})["response"]
    currentTs = ts
    if ts == None:
        currentTs = response["ts"]
    LongPollResponse = requests.get(response["server"], params={"act": "a_check", "key": response["key"], "ts": currentTs, "wait": wait}).json()
    callback(LongPollResponse)
    groupLongPoll(access_token, group_id, callback, wait, version, LongPollResponse["ts"])

def userLongPoll(access_token, callback, wait=STANDARD_LongPollWait, mode=STANDARD_LongPollMode, version=STANDARD_LongPollVersion, ts=None):
    response = method(access_token, "messages.getLongPollServer")["response"]
    currentTs = ts
    if ts == None:
        currentTs = response["ts"]
    LongPollResponse = requests.get("https://" + response["server"], params={"act": "a_check", "key": response["key"], "ts": currentTs, "wait": wait}).json()
    callback(LongPollResponse)
    userLongPoll(access_token, callback, wait, version, LongPollResponse["ts"])

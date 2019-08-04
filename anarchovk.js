// anarchovk v2.1
// github.com/dezzev/



const http = require("https");


const STANDARD_LongPollWait = 25; // Стандартное время ожидания лонгполла
const STANDARD_LongPollVersion = 3; // Стандартная версия User Long Poll
const STANDARD_LongPollMode = 2; // Доп. опции лонгполла по стандарту
const STANDARD_Version = "5.101"; // Версия VK Api


function VKError(error_code, error_msg, request_params){
	this.name = "VK Error";
	this.message = error_msg + "\nError code: " + error_code + "\nRequest params: " + request_params;
};


function method(access_token, method_name, method_params={}, callback=null, version=STANDARD_Version){
	const uriParams = encodeURI(Object.keys(method_params).map(key => key + '=' + method_params[key]).join('&'));
	http.get("https://api.vk.com/method/" + method_name + "?v=" + version + "&access_token=" + access_token + "&" + uriParams, response => {
		response.setEncoding("utf8");
		response.on("data", data => {
			const responseObject = JSON.parse(data);
			if (responseObject.hasOwnProperty("error")){
				throw new VKError(responseObject.error.error_code, responseObject.error.error_msg, JSON.stringify(responseObject.error.request_params));
			}
			else{
				if (callback != null){
					callback(responseObject);
				}
			};
		});
	});
};

function groupLongPoll(access_token, group_id, callback, wait=STANDARD_LongPollWait, version=STANDARD_Version){
	method(access_token, "groups.getLongPollServer", {"group_id": group_id}, function (LongPollServer){
		const response = LongPollServer.response;
		http.get(response.server + "?act=a_check&key=" + response.key + "&ts=" + response.ts + "&wait=" + wait, LongPollResponse => {
			LongPollResponse.setEncoding("utf8")
			LongPollResponse.on("data", data => {
				callback(JSON.parse(data));
				groupLongPoll(access_token, group_id, callback);
			});
		});
	});
};

function userLongPoll(access_token, callback, wait=STANDARD_LongPollWait, mode=STANDARD_LongPollMode, version=STANDARD_LongPollVersion){
	method(access_token, "messages.getLongPollServer", {}, LongPollServer => {
		const response = LongPollServer.response;
		http.get("https://" + response.server + "?act=a_check&key=" + response.key + "&ts=" + response.ts + "&wait=" + wait + "&mode=" + mode + "&version=" + version, LongPollResponse => {
			LongPollResponse.setEncoding("utf8")
			LongPollResponse.on("data", data => {
				callback(JSON.parse(data));
				userLongPoll(access_token, callback, wait, mode, version);
			});
		});
	});
};


module.exports = {method, groupLongPoll, userLongPoll}

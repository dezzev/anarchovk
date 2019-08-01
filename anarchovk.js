// anarchovk v2.0
// vk.com/dezzev

/*  
	ДИСКЛЕЙМЕР: Некоторые из представленных 
	функций могут оказаться диким 
	говнокодом… 
	Но мне как-то похуй.
*/



const http = require("https");


const STANDARD_LongPollWait = 25; // Стандартное время ожидания лонгполла
const STANDARD_LongPollVersion = 3; // Стандартная версия User Long Poll
const STANDARD_LongPollMode = 2; // Доп. опции лонгполла по стандарту
const STANDARD_Version = "5.101"; // Версия VK Api


function method(access_token, method_name, method_params, callback=null, version=STANDARD_Version){
	const uriparams = encodeURI(Object.keys(method_params).map(key => key + '=' + method_params[key]).join('&'));
	http.get("https://api.vk.com/method/" + method_name + "?v=" + version + "&access_token=" + access_token + "&" + uriparams, response => {
		response.setEncoding("utf8");
		if (callback != null){
			response.on("data", data => {
				callback(JSON.parse(data));
			});
		}
	});
};

function groupLongPoll(access_token, group_id, callback, wait=STANDARD_LongPollWait, version=STANDARD_Version){
	http.get("https://api.vk.com/method/groups.getLongPollServer?v=" + version + "&access_token=" + access_token + "&group_id=" + group_id, response => {
		response.setEncoding("utf8");
		response.on("data", getLongPoll => {
			const LongPollServer = JSON.parse(getLongPoll);
			if (LongPollServer.hasOwnProperty("response")){
				const response = LongPollServer.response;
				http.get(response.server + "?act=a_check&key=" + response.key + "&ts=" + response.ts + "&wait=" + wait, LongPollResponse => {
					LongPollResponse.setEncoding("utf8")
					LongPollResponse.on("data", data => {
						callback(JSON.parse(data));
						groupLongPoll(access_token, group_id, callback);
					});
				});
			}
			else{
				console.log(getLongPoll);
			};
		});
	});
};

function userLongPoll(access_token, callback, wait=STANDARD_LongPollWait, mode=STANDARD_LongPollMode, LongPollVersion=STANDARD_LongPollVersion, apiVersion=STANDARD_Version){
	http.get("https://api.vk.com/method/messages.getLongPollServer?v=" + apiVersion + "&access_token=" + access_token, response => {
		response.setEncoding("utf8");
		response.on("data", getLongPoll => {
			const LongPollServer = JSON.parse(getLongPoll);
			if (LongPollServer.hasOwnProperty("response")){
				const response = LongPollServer.response;
				http.get("https://" + response.server + "?act=a_check&key=" + response.key + "&ts=" + response.ts + "&wait=" + wait + "&mode=" + mode + "&version=" + LongPollVersion, LongPollResponse => {
					LongPollResponse.setEncoding("utf8")
					LongPollResponse.on("data", data => {
						callback(JSON.parse(data));
						userLongPoll(access_token, callback, wait, mode, LongPollVersion, apiVersion);
					});
				});
			}
			else{
				console.log(getLongPoll);
			};
		});
	});
};

module.exports = {method, groupLongPoll, userLongPoll}

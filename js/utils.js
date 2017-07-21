
function parseQueryString() {
	var url = window.location.href;
	var obj = {};
	var keyvalue = [];
	var key = "",
		value = "";
	var paraString = url.substring(url.indexOf("?") + 1, url.length).split("&");
	for(var i in paraString) {
		keyvalue = paraString[i].toString().split("=");
		key = keyvalue[0];
		value = keyvalue[1];
		obj[key] = value;
	}
	return obj;
}

function setCookie(name, value) {
	if(isEmpty(name)) {
		return;
	}
	sessionStorage.setItem(name, value);
}

function getCookieValue(str) {
	return sessionStorage.getItem(str);
}

function deleteCookie(name) {
	sessionStorage.removeItem(name);
}

//　这样就解决了存储问题。
//要想成功展示表情符还得转回来。
//表情解码
function entitiestoUtf16(str) {
	if(!str) {
		return;
	}
	// 检测出形如&#12345;形式的字符串
	var strObj = utf16toEntities(str);
	var patt = /&#\d+;/g;
	var H, L, code;
	var arr = strObj.match(patt) || [];
	for(var i = 0; i < arr.length; i++) {
		code = arr[i];
		code = code.replace('&#', '').replace(';', '');
		// 高位
		H = Math.floor((code - 0x10000) / 0x400) + 0xD800;
		// 低位
		L = (code - 0x10000) % 0x400 + 0xDC00;
		code = "&#" + code + ";";
		var s = String.fromCharCode(H, L);
		//      alert(s);
		strObj = strObj.replace(code, s);
	}
	return strObj;
}

function utf16toEntities(str) {
	var patt = /[\ud800-\udbff][\udc00-\udfff]/g;
	// 检测utf16字符正则
	str = str.replace(patt, function(char) {
		var H, L, code;
		if(char.length === 2) {
			H = char.charCodeAt(0);
			// 取出高位
			L = char.charCodeAt(1);
			// 取出低位
			code = (H - 0xD800) * 0x400 + 0x10000 + L - 0xDC00;
			// 转换算法
			return "&#" + code + ";";
		} else {
			return char;
		}
	});
	return str;
}

function toJson(source) {
	var jsonStr;
	try{
		jsonStr = JSON.stringify(source)
	}catch(e){
		console.log(e);
		console.log('json转换异常');
	}
	return jsonStr;
}

var isEmpty = function(target) {
	if('undefined' == target || '' == target || 'null' == target || undefined == target || null == target) {
		return true;
	}

	return false;
}

var isNotEmpty = function(target) {
	if(isEmpty(target)) {
		return false;
	}
	return true;
}

// JavaScript Document
var http_request = null;
//封装get方法的ajax函数
var music_info = {status:0, value:null};//status：0代表数据没有获取完成，1代表已经完成；num是获取到的数据条数
var page_list = {status:0, num:0, value:null};

function ajax_for_json(url, space, query_string=null, header=null)//请求url,请求参数(对象),请求头(对象)
{
	if (window.XMLHttpRequest){//chrome firefox...
		http_request = new XMLHttpRequest();
	}
	else if (window.ActiveXObject){//IE5 and IE6
		http_request = new ActiveXObject("Microsoft.XMLHTTP");
	}
	else{
		alert("你的浏览器不支持XMLHttpRequest!");
		return;
	}
	//组合最终带参数的url
	var url_string = url+"?";
	if(query_string !== null){
		for(var i in query_string){
			url_string = url_string + i + "=" + query_string[i] + "&";
		}
	}
	url_string = url_string.substring(0, url_string.length-1);
	//初始化请求
	http_request.open("GET", url_string, true);//异步请求
	//添加头部
	if(header != null){
		for(var i in header){
			http_request.setRequestHeader(header[i].key,header[i].value);
			console.log(header[i].key +":"+header[i].value);
		}
	}
	//发起请求
	http_request.send(null);
	http_request.onreadystatechange=function(){
		if(http_request.readyState === XMLHttpRequest.DONE && http_request.status === 200){
			//正确返回
			//page_list.value.length = 0;
			space.value = JSON.parse(http_request.responseText);
			space.status = 1;
		}
	};
}
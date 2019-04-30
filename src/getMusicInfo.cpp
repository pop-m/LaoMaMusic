#include<iostream>
#include<http.h>
#include<json/json.h>
#include<string.h>
#include<debug_log.h>

#include<unistd.h>
#include<sys/types.h>
#include<sys/stat.h>
#include<fcntl.h>

void return_server_error()
{
	Log log;
	log.write_log("getMusicInfo:server_error");
}
void return_client_error()
{
	Log log;
	log.write_log("getMusicInfo:return_json_false");
}

int cookie_check_user(const char* cookies)
{
	Log log;
	log.write_log("getMusicInfo:cookies:");
	log.write_log(cookies);
	return 1;
}

int search_music(const char* query_string)
{
	Log log;

	char fileHash[256];
	memset(fileHash, 0x00, sizeof(fileHash));
	const char* index = strstr(query_string, "fileHash=");
	index += 9;
	int i = 0;
	while(*index != 0 && *index != '&'){
		fileHash[i++] = *index++;
	}

	//调用第一个API
	int sock = create_socket();
	if(sock == -1){
		log.write_log("getMusicInfo:服务器创建socket失败");
		return -1;
	}
	char hostname[] = "wwwapi.kugou.com";
	int conn_ret = connect_to(sock, hostname);
	if(conn_ret == -1){
		log.write_log("getMusicInfo:API域名解析失败");
		return -1;
	}else if(conn_ret == -2){
		log.write_log("getMusicInfo:API连接失败");
		return -1;
	}

	char url[512];
	memset(url, 0x00, 512);
	sprintf(url, "/yy/index.php?r=play/getdata&callback=jQuery19108833191028495151_1551681176079&hash=%s", fileHash);

	log.write_log(url);

	get_request(sock, url, hostname);

	clear_head(sock);
	char c = 0;
	std::string body= "";
	while(recv(sock, &c, 1, 0)){
		body += c;
	}
	close(sock);
	log.write_log("getMusicInfo:API请求完成");

	body.pop_back();
	body.pop_back();
	const char* start = strchr(body.c_str(), '(') + 1;

	//json解析
	Json::Reader reader;
	Json::Value root;
	if(reader.parse(start, root)){
		if(root["status"].asInt() == 1){
			Json::Value ele;
			ele["author_name"] = root["data"]["author_name"].asCString();
			ele["song_name"] = root["data"]["song_name"].asCString();
			ele["timelength"] = root["data"]["timelength"].asInt();
			ele["play_url"] = root["data"]["play_url"].asCString();
			ele["img"] = root["data"]["img"].asCString();
			std::cout<<"Content-Type: application/json\r\n";
			std::cout<<"\r\n";
			std::cout<<ele.toStyledString()<<"\r\n";
			return 0;

		}else{
			return -1;
		}
	}else{
		return -1;
	}
}


int main(){
	const char *method = getenv("REQUEST_METHOD");
	if(strcasecmp(method, "GET") == 0){
		//获取cookies
		//const char *cookies = "coooookie";//getenv("HTTP_COOKIE");
		//进行用户身份验证 cookie_check_user()
		if(1){
			//身份验证成功，进行搜索
			//获取搜索的关键字
			const char *query_string = getenv("QUERY_STRING");
			if(search_music(query_string) != 0){
				return_server_error();
			}
		}
	}else{
		return_client_error();
	}
	return 0;
}


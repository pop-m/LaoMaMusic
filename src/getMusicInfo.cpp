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
	char hostname[] = "m.kugou.com";
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
	sprintf(url, "/app/i/getSongInfo.php?cmd=playInfo&hash=%s", fileHash);

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
	const char* start = body.c_str();

	//json解析
	Json::Reader reader;
	Json::Value root;
	if(reader.parse(start, root)){
		if(root["status"].asInt() == 1){
			Json::Value ele;
			ele["author_name"] = root["singerName"].asCString();
			ele["song_name"] = root["songName"].asCString();
			ele["timelength"] = root["timeLength"].asInt();
			ele["play_url"] = root["url"].asCString();
			std::string img_url = root["imgUrl"].asString();
			size_t pos = img_url.find("{size}");
			if(pos != std::string::npos){
				ele["img"] = img_url.replace(pos, 6, "200");
			}else{
				ele["img"] = "/img/default-music-img.png";
			}
			ele["error"] = "";
			std::cout<<"Content-Type: application/json\r\n";
			std::cout<<"\r\n";
			std::cout<<ele.toStyledString()<<"\r\n";
			return 0;

		}else{
			Json::Value ele;
			ele["error"] = root["error"].asString();
			std::cout<<"Content-Type: application/json\r\n";
			std::cout<<"\r\n";
			std::cout << ele.toStyledString() << std::endl;
			return 0;
		}
	}else{
		log.write_log("getmusicinfo:返回json解析错误！");
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


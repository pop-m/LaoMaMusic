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
	log.write_log("server_error");
}
void return_client_error()
{
	Log log;
	log.write_log("return_json_false");
}

int cookie_check_user(const char* cookies)
{
	Log log;
	log.write_log("cookies:");
	log.write_log(cookies);
	return 1;
}

int search_music(const char* query_string)
{
	Log log;

	char keywords[256];
	memset(keywords, 0x00, sizeof(keywords));
	const char* index = strstr(query_string, "keyword=");
	index += 8;
	int i = 0;
	while(*index != 0 && *index != '&'){
		keywords[i++] = *index++;
	}

	//调用第一个API
	int sock = create_socket();
	if(sock == -1){
		log.write_log("服务器创建socket失败");
		return -1;
	}
	char hostname[] = "songsearch.kugou.com";
	int conn_ret = connect_to(sock, hostname);
	if(conn_ret == -1){
		log.write_log("API域名解析失败");
		return -1;
	}else if(conn_ret == -2){
		log.write_log("API连接失败");
		return -1;
	}

	char url[512];
	memset(url, 0x00, 512);
	sprintf(url, "/song_search_v2?callback=jQuery191034642999175022426_1489023388639&keyword=%s&page=1&pagesize=100&userid=-1&clientver=&platform=WebFilter&filter=2&iscorrection=1&privilege_filter=0", keywords);

	log.write_log(url);

	get_request(sock, url, hostname);

	clear_head(sock);
	char c = 0;
	std::string body= "";
	while(recv(sock, &c, 1, 0)){
		body += c;
	}
	close(sock);
	log.write_log("API请求完成");

	body.pop_back();
	body.pop_back();
	const char* start = strchr(body.c_str(), '(') + 1;

	//json解析
	Json::Reader reader;
	Json::Value root;
	Json::Value return_json;
	if(reader.parse(start, root)){
		if(root["status"].asInt() == 1){
			Json::Value music_list = root["data"]["lists"];
			int size = music_list.size();
			for(int i=0; i<size; i++){
				Json::Value ele;
				ele["SongName"] = music_list[i]["SongName"].asCString();
				ele["SingerName"] = music_list[i]["SingerName"].asCString();
				ele["AlbumName"] = music_list[i]["AlbumName"].asCString();
				ele["FileHash"] = music_list[i]["FileHash"].asCString();
				ele["Duration"] = music_list[i]["Duration"].asInt();
				return_json.append(ele);
			}
			std::cout<<"Content-Type: application/json\r\n";
			std::cout<<"\r\n";
			std::cout<<return_json.toStyledString()<<"\r\n";
			return 0;

		}else{
			return -1;
		}
	}else{
		return -1;
	}
	return 0;
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


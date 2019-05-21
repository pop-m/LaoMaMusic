#include<iostream>
#include<http.h>
#include<json/json.h>
#include<string.h>
#include<debug_log.h>

#include<unistd.h>
#include<sys/types.h>
#include<sys/stat.h>
#include<fcntl.h>

int main(){
	//1.获取username和password
	
	const char *method = getenv("REQUEST_METHOD");
	if(strcasecmp(method, "GET") == 0){
		if(1){
			//获取搜索的关键字
			const char *query_string = getenv("QUERY_STRING");
		}
	}
	//2.进行数据库查询
	//3.生成sessionId,并插入数据库
	//4.生成json文件并返回
	return 0;
}

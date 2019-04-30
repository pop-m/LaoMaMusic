#ifndef __HTTP_H__
#define __HTTP_H__


#include<unistd.h>
#include<sys/socket.h>
#include<arpa/inet.h>
#include<netinet/in.h>
#include<string.h>
#include<netdb.h>
#include<ctype.h>
#include<fcntl.h>
#include<stdio.h>


/*将十六进制数转为十进制*/
int hex_to_decade(char * s);
void url_to_gb_or_utf(char *get_url, char *return_gb_or_utf);

int create_socket();

int connect_to(int sock, char *hostname);


void clear_head(int sock);

//发送get的请求
void get_request(int sock, char* url, char* hostname);


#endif // __HTTP_H__

#include<http.h>
#include<debug_log.h>

int hex_to_decade(char * s)
{
    const char *digits="0123456789ABCDEF";
 
    /*判断大小写，小写的话转为大写，达到统一*/
    if (islower (s[0]))
        s[0]=toupper(s[0]);
    if (islower (s[1]))
        s[1]=toupper(s[1]);
 
    return 16*(strchr(digits,s[0])-strchr(digits,'0'))+(strchr(digits,s[1])-strchr(digits,'0'));
}

void url_to_gb_or_utf(char *get_url, char *return_gb_or_utf)
{
    int url_position;/*用来保存get_url的位置*/
    int return_position;/*用来保存解码后的字符串的位置*/
    int url_len;/*用来保存get_url的长度*/
    char tmp[2];/*保存%后面的十六进制字符*/
    url_len = strlen(get_url);
    return_position = 0;
 
    for ( url_position = 0; url_position < url_len; )
    {
        /*如果是%将它后面的十六进制字符考到数组里*/
        if ( get_url[url_position] == '%' ){
            tmp[0] = get_url[url_position+1];/*第一个十六进制字符*/
            tmp[1] = get_url[url_position+2];/*第二个*/
        //  tmp[2] = '\0';  **串口通信中会出现乱码，结尾必须不能有其他字符**
 
            url_position+= 3; /*使url_position跳到的下一个%*/
            /*将十六进制数转为十进制后考入要返回的数组里*/
 
            return_gb_or_utf[return_position] = hex_to_decade(tmp);
        }
        /*如果不是特殊字符，如英文，数字那么直接返回*/
        else{
            return_gb_or_utf[return_position] = get_url[url_position];
            url_position++;
        }
        return_position++;
    }
 
    return_gb_or_utf[return_position] = 0;
}

int create_socket()
{
	int sock = socket(AF_INET, SOCK_STREAM, 0);
	if(sock < 0){
		return -1;
	}
	return sock;
}

int connect_to(int sock, char *hostname)
{
	//根据域名解析主机地址
	struct hostent *hs = gethostbyname(hostname);
	if(hs == NULL)
	{
		Log log;
		char err[50];
		memset(err, 0x00, 50);
		sprintf(err, "%s解析错误!", hostname);
		log.write_log(err);
		return -1;
	}
	struct sockaddr_in server_addr;
	server_addr.sin_family = AF_INET;
	server_addr.sin_port = htons(80);
	int i = 0;
	server_addr.sin_addr = *((struct in_addr*)hs->h_addr_list[0]);
	socklen_t len = sizeof(server_addr);
	while(connect(sock, (struct sockaddr*)&server_addr, len) < 0)
	{
		if(hs->h_addr_list[++i] != NULL)
		{
			server_addr.sin_addr = *((struct in_addr*)hs->h_addr_list[i]);
		}
		else
		{
			Log log;
			char err[50];
			memset(err, 0x00, 50);
			sprintf(err, "%s解析错误!", hostname);
			log.write_log(err);
			return -2;
		}
	}
	return 0;
}

static void read_line(int sock, char *line, int size)	
{
	char c = 'x';
	int i = 0;
	while(c != '\n' && i < size)
	{
		int s = recv(sock, &c, 1, 0);
		if(s < 0)
		{
			//return_error();
		}
		if(c == '\r')
		{
			recv(sock, &c, 1, MSG_PEEK);
			if(c == '\n')
			{
				recv(sock, &c, 1, 0);
			}
			c = '\n';
		}
		line[i++] = c;
	}
	line[i] = 0;
}

void clear_head(int sock)
{
	char line[1024] = {0};
	do
	{
		read_line(sock, line, 1023);	
	}while(strcmp(line, "\n"));
}

void get_request(int sock, char* url, char* hostname)
{
	//构造key的请求
	char first_line[1024];
	memset(first_line, 0x00, sizeof(first_line));
	Log log;
	sprintf(first_line, "GET %s HTTP/1.0\r\n", url);
	log.write_log(first_line);
	send(sock, first_line, strlen(first_line), 0);

	char header_1[128];
	memset(header_1, 0x00, sizeof(header_1));
	sprintf(header_1, "Host: %s\r\n", hostname);
	send(sock, header_1, strlen(header_1), 0);
	log.write_log(header_1);

	send(sock, "\r\n", 2, 0);
}

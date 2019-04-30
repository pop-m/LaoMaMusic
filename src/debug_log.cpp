#include<debug_log.h>
#include<stdio.h>


Log::Log()
{
	fd = open("/usr/local/apache/cgi-bin/mylog.log",O_WRONLY|O_APPEND);
}

void Log::write_log(const char* str)
{
	write(fd, str, strlen(str));
	write(fd, "\n", 1);
	fflush(NULL);
}

Log::~Log()
{
	close(fd);
}


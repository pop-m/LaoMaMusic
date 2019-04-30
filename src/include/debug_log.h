#ifndef __DEBUG_LOG__
#define __DEBUG_LOG__

#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <string.h>
#include <unistd.h>

class Log{
public:
	Log();
	void write_log(const char* str);
	~Log();
private:
	int fd;
};

#endif //__DEBUG_LOG_H

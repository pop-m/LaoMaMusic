.PHONY: ../searchSongName.cgi clean

json_src = ./json
http_src = ./http
json_o = json_reader.o json_value.o json_writer.o
http_o = http.o
log_o = debug_log.o

all : ../searchSongName.cgi ../getMusicInfo.cgi

../searchSongName.cgi : searchSongName.o $(http_o) $(log_o) $(json_o)
	g++ $^ -o $@ 

../getMusicInfo.cgi : getMusicInfo.o $(http_o) $(log_o) $(json_o)
	g++ $^ -o $@

%.o : %.cpp
	g++ -c $< -o $@ -I ./include

%.o : $(http_src)/%.cpp
	g++ -c $< -o $@ -I ./include

%.o : $(json_src)/%.cpp
	g++ -c $< -o $@ -I ./include

clean:
	rm -rf *.o ../searchSongName.cgi ../getMusicInfo.cgi

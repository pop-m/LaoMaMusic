// JavaScript Document
var aud;
var music_list = new Array();//全局的音乐列表
var playing_index = -1;//当前播放的音乐在列表中的下标
var player_stat = 1;//当前播放器状态（1:暂停 2:播放）
//初始化播放器数据
function init_player()
{
	"use strict";
	//创建audio标签
	aud = document.createElement("audio");
	aud.setAttribute('id','audio');
	playing_index=-1;
	if(music_list.length !== 0){
		//清空music_list
		music_list.length = 0;
	}
	set_volume(0.5);
	player_stat = 1;
}

//向播放器列表添加音乐
function add_to_list(music_name, music_src, music_author, img_src, music_time)
{
	"use strict";
	var music_info = {"music_name":music_name,"music_src":music_src,"music_author":music_author,"img_src":img_src,"music_time":music_time};
	music_list.push(music_info);
}

//播放音乐
function play()
{
	"use strict";
	console.log(aud.src === music_list[playing_index].music_src);
	if(aud.src === music_list[playing_index].music_src){
		//如果只是暂停与播放情况，继续播放即可
		aud.play();
	}
	else{
		//如果是下一曲的情况,就需要播放index所指的文件
		aud.src = music_list[playing_index].music_src;
		aud.play();
	}
}

//暂停音乐
function pause()
{
	"use strict";
	aud.pause();
}
//下一曲
function next_music()
{
	"use strict";
	if(player_stat === 2){
		pause();
	}
	if(playing_index !== music_list.length - 1){
		playing_index++;
	}
	else{
		playing_index = 0;
	}
	if(player_stat === 2){
		play();
	}
}
//上一曲
function pre_music()
{
	"use strict";
	if(player_stat === 2){
		pause();
	}
	if(playing_index > 0){
		playing_index--;
	}
	else{
		playing_index = music_list.length-1;
	}
	if(player_stat === 2){
		play();
	}
}
//获得当前时间
function get_cur_time()
{
	return(aud.currentTime);
}
//获得音乐时长
function get_all_time()
{
	"use strict";
	return(music_list[playing_index].music_time);
}
//播放指定时间
function play_to_time(time_s)
{
	aud.currentTime = time_s;
}
//是否已经结束播放
function is_over()
{
	"use strict";
	return(aud.ended);
}
//调节音量
function set_volume( volume_value )
{
	"use strict";
	aud.volume = volume_value;
}
//播放指定音乐
function play_to_music( index )
{
	"use strict";
	if(player_stat === 2){
		pause();
	}
	playing_index = index;
	if(player_stat === 2){
		play();
	}
}


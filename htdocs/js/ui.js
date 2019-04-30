// JavaScript Document
/*jshint multistr: true */
var mouse_x;//鼠标点距离屏幕左侧的距离
var start_value;//滚动条刚开始的百分比数字
var all_width;//外面盒子的大小
var only_control=1;//0：鼠标控制进度条 1:音乐事件控制进度条
var eve = event || window.event;
var deg_stat;//用于存储图片旋转的定时器
var get_time;//用于存储进度条的定时器
var page_width = 20;//页面宽度 
var page_cur = 1;//当前的页码
window.onload=function(){
	"use strict";
	document.getElementById("show_login").onclick = shog_login;//点击登录按钮显示登录窗口
	document.getElementsByClassName("closs-btn")[0].onclick = close_login;	//点击关闭按钮关闭登录窗口
	document.getElementById("player_show").onclick = show_player;  //点击显示播放器
	init_player();//初始化音乐播放器
	document.getElementById("player_play").onclick = music_play;   //点击播放音乐
	document.getElementById("player_pre").onclick = music_pre;//上一曲
	document.getElementById("player_next").onclick = music_next;//下一曲
	document.getElementById("cur_point").onmousedown = change_time;//拖动进度条
	document.getElementById("volume_cur").onmousedown = change_volume;//拖动音量条
	document.getElementById("ranking_list").onclick = show_ranking_list;//显示排行榜
	get_music_page_list("/rankingList.json");
	flush_page();
	document.getElementById("search_box").onkeydown = submit_search;//提交搜索框
};

//显示排行榜
function show_ranking_list()
{
	get_music_page_list("/rankingList.json");
	flush_page();
}
//显示登录窗口
function shog_login()
{
	"use strict";
	var login_window = document.getElementsByClassName("login-form")[0];
	var cover = document.getElementsByClassName("login-back")[0];
	login_window.style.display = "block";
	cover.style.display = "block";
}
//关闭登录窗口
function close_login()
{
	"use strict";
	var login_window = document.getElementsByClassName("login-form")[0];
    var cover = document.getElementsByClassName("login-back")[0];
    login_window.style.display = "none";
    cover.style.display = "none";
}
//关闭和显示音乐播放器
function show_player()
{
	"use strict";
	var step = 5;
	var ele = document.getElementById("player_show");
	var player = document.getElementById("player_back");
	var botm = 0;
	if(ele.src.substr(ele.src.length-5) === "n.png"){
		//应该向下移动
		botm = 0;
		var down = setInterval(function(){
			if(botm === -80){
				clearInterval(down);
			}
			else{
				botm -= step;
				player.style.bottom = botm + "px";
			}
		},10);
		ele.src = "img/up.png";
	}
	else{
		//应该向上移动
		botm = -80;
		var up = setInterval(function(){
			if(botm === 0){
				clearInterval(up);
			}
			else{
				botm += step;
				player.style.bottom = botm + "px";
			}
		},10);
		ele.src = "img/down.png";
	}
}


function submit_search(eve)
{
	if(eve.keyCode === 13){
		//执行ajax请求
		//url：  "/cgi/searchSongName"
		//method： "GET"
		//param: "Name:XXXX"
		//headers: "cookie:xxxx"
		var query_string = {"keyword":document.getElementById("search_box").value};
		get_music_page_list("/cgi/searchSongName.cgi",query_string);
		flush_page();
	}

}

//刷新播放器显示
function flush_player_view()
{
	"use strict";
	document.getElementById("music_img").src=music_list[playing_index].img_src;
	document.getElementById("music_name").innerText=music_list[playing_index].music_name;
	document.getElementById("music_author").innerText=music_list[playing_index].music_author;
	document.getElementById("going_line").style.width="0%";
	document.getElementById("music_img").style.transform="rotate(0deg)";
	var all_time = parseInt(parseInt(get_all_time())/1000);
	document.getElementById("all_time").innerText = ms_to_time(all_time);
}

//将秒时间转化为00:00格式  123.6789
function ms_to_time(time_vale)
{
	"use strict";
	var seconds = parseInt(time_vale);
	var front = parseInt(seconds/60);
	var end = seconds % 60;
	var front_value;
	var end_value;
	if( front < 10 ){
	   front_value = "0"+front;
	}
	else if(front >= 60){
		front_value = "59";		
	}
	else{
		front_value = front;
	}
	if( end < 10 ){
	   end_value = "0"+end;
	}
	else if(end >= 60){
		end_value = "59";		
	}
	else{
		end_value = end;
	}
	return(front_value+":"+end_value);
}

function time_to_s(time)
{
	"use strict";
	var front = parseInt(time.substring(0,2));
	var end = parseInt(time.substring(3,5));
	return(front*60 + end);
}

//显示当前播放时间和滚动的进度条
function show_cur_time()
{
	var time_ele = document.getElementById("used_time");
	var going_line = document.getElementById("going_line");
	get_time = setInterval(function(){
		if(only_control === 1){//如果为1说明当前是播放的事件在控制进度条
			var cur_time = get_cur_time();
			var time_total = get_all_time();
			var width = ((cur_time*1000/time_total)*100).toFixed(2);
			going_line.style.width = width+"%";
			time_ele.innerText = ms_to_time(cur_time);
			if(is_over()){//播放已经结束                      默认下一曲播放
				document.getElementById("player_play").src="img/play.png";
				player_stat = 1;
				music_next();
				music_play();
			}
		}
	},500);
}

//播放的时候旋转图片
function rotate()
{
	"use strict";
	var ele = document.getElementById("music_img");
	var start_deg = ele.style.transform.substring(7,ele.style.transform.length-4);
	var end_deg = start_deg;
	deg_stat = setInterval(function(){
		end_deg = parseInt(end_deg) + 3;
		if(end_deg === 360){
			end_deg = 0;
		}
		ele.style.transform = "rotate(" + end_deg + "deg)";
		if(player_stat !== 2){
			clearInterval(deg_stat);
		}
	},50);
}

//音量条的拖动
function change_volume(eve)
{
	"use strict";
	if(eve.button === 0){
		mouse_x = eve.clientX;//获取鼠标的X
		var box = document.getElementById("volume_all");
		var small_box = document.getElementById("volume_going_line");
		all_width = box.style.width.substring(0,box.style.width.length-2);
		start_value = small_box.style.width.substring(0,small_box.style.width.length-1);//获得最初的长度（百分数）
		document.addEventListener('mousemove', volume_move);//开始监听鼠标的移动事件
		document.addEventListener('mouseup', volume_stop);//开始监听鼠标的松开事件
	}
}
function volume_move(eve)
{
	"use strict";
	var diff_px = eve.clientX - mouse_x;//鼠标变化的px
	var diff_b = (diff_px*100/all_width);//鼠标变化所占总宽度的百分比
	var offset = parseInt(start_value) + diff_b;//当前应该占的百分比
	if(offset >= 100){
		offset = 100;
	}
	else if(offset < 0){
		offset = 0;
	}
	document.getElementById("volume_going_line").style.width = offset + "%";
	set_volume(parseFloat(offset)/100);
}
function volume_stop()
{
	"use strict";
	document.removeEventListener('mousemove', volume_move);
	document.removeEventListener('mouseup', volume_stop);
}

//进度条的拖动
function change_time(eve)
{
	"use strict";
	if(eve.button === 0){//鼠标左键
		mouse_x = eve.clientX;//获取鼠标的X
		only_control = 0;//鼠标点击的时候进度条立马暂停
		var box = document.getElementById("controler_all");
		var small_box = document.getElementById("going_line");
		all_width = box.style.width.substring(0,box.style.width.length-2);
		start_value = small_box.style.width.substring(0,small_box.style.width.length-1);//获得最初的长度（百分数）
		document.addEventListener('mousemove', move);//开始监听鼠标的移动事件
		document.addEventListener('mouseup', stop);//开始监听鼠标的松开事件
	}
}
function move(eve) 
{
	"use strict";
	var diff_px = eve.clientX - mouse_x;//鼠标变化的px
	var diff_b = (diff_px*100/all_width);//鼠标变化所占总宽度的百分比
	var offset = parseInt(start_value) + diff_b;//当前应该占的百分比
	if(offset >= 100){
		offset = 100;
	}
	else if(offset < 0){
		offset = 0;
	}
	document.getElementById("going_line").style.width = offset + "%";
	document.getElementById("used_time").innerText = ms_to_time(get_all_time() * offset / 100000);
}
function stop()
{
	"use strict";
	document.removeEventListener('mousemove', move);
	document.removeEventListener('mouseup', stop);
	play_to_time(time_to_s(document.getElementById("used_time").innerText));
	only_control = 1;//鼠标松开进度条由音乐进度控制
}

//播放和暂停
function music_play()
{
	"use strict";
	if(player_stat === 1){
		//暂停状态，需要播放
		if(playing_index == -1){
			alert("播放列表还没有歌曲呦！");
			return;
		}
		document.getElementById("player_play").src="img/pause.png";
		play();
		player_stat = 2;
		show_cur_time();
		rotate();
	}
	else{
		//播放状态，需要暂停
		document.getElementById("player_play").src="img/play.png";
		pause();
		player_stat = 1;
		clearInterval(deg_stat);
		clearInterval(get_time);
	}
}
function music_pre()
{
	"use strict";
	document.getElementById("used_time").innerText="00:00";
	clearInterval(deg_stat);
	clearInterval(get_time);
	pre_music();
	flush_player_view();
	if(player_stat === 2){
		show_cur_time();
		rotate();
	}
}
function music_next()
{
	"use strict";
	document.getElementById("used_time").innerText="00:00";
	clearInterval(deg_stat);//只要是点击了下一曲，都应该将所有的定时器先关闭，然后再将界面刷新
	clearInterval(get_time);
	next_music();
	flush_player_view();
	if(player_stat === 2){
		show_cur_time();
		rotate(); 
	}
}

//将音乐添加至页面显示列表

function change_music(num)
{
	"use strict";
	//ajax请求音乐信息并加入播放列表
	var query_string = {"fileHash":page_list.value[num].FileHash};
	var time_total = 0;
	//ajax请求音乐信息
	get_music_info("/cgi/getMusicInfo.cgi",query_string);
	var ajax_timeout = setInterval(function(){
		if(music_info.status === 1){
			//ajax获取到了数据
			//添加至播放器的播放列表
			add_to_list(music_info.value.song_name,music_info.value.play_url,music_info.value.author_name,music_info.value.img,music_info.value.timelength);
			//重绘完成
			clearInterval(ajax_timeout);
			music_info.status = 0;

			//播放最后一首歌曲
			document.getElementById("used_time").innerText="00:00";
			//改index之前如果歌曲是播放状态，就先暂停
			if(player_stat === 2){
				music_play();
			}
			play_to_music(music_list.length-1);
			//改index之后如果歌曲是暂停状态，就播放
			if(player_stat === 1 ){
				music_play();
			}
			flush_player_view();
		}
		else{
			//ajax还没有获取到数据
			if(40 <= time_total++){
				clearInterval(ajax_timeout);
				alert("你的网络貌似不太好！");
			}
		}
	},500);
}
//下载页面所对应的歌曲
function download_music(num)
{
	"use strict";
	//进行ajax请求通过hash获取音乐的url以及img的url

	//ajax请求音乐信息并加入播放列表
	var query_string = {"fileHash":page_list.value[num].FileHash};
	var time_total = 0;
	//ajax请求音乐信息
	get_music_info("/cgi/getMusicInfo.cgi",query_string);
	var ajax_timeout = setInterval(function(){
		if(music_info.status === 1){
			//ajax获取到了数据
			clearInterval(ajax_timeout);
			window.open(music_info.value.play_url,"_blank");
		}
		else{
			//ajax还没有获取到数据
			if(40 <= time_total++){
				clearInterval(ajax_timeout);
				alert("你的网络貌似不太好！");
			}
		}
	},500);
}

function flush_music_list()
{
	"use strict";
	var html_code = '';
	var right_border = page_cur*page_width;
	if(right_border > page_list.value.length){
		right_border = page_list.value.length;
	}
	for(var i=(page_cur-1)*page_width; i<right_border; i++){
		html_code += '\
		<div class="ui-row">\
			<div class="ui-col ui-col-number">\
				<p class="ui-text ui-number-text">'+(parseInt(i)+1)+'</p>\
			</div>\
			<div class="ui-col ui-col-song overflow-style">\
				<div class="ui-name-singer">\
					<div class="ui-music-name-singer">\
						<p class="ui-name-text">'+page_list.value[i].SongName+'</p>\
					</div>\
					<div class="ui-music-name-singer">\
						<p class="ui-singer-text">'+page_list.value[i].SingerName+'</p>\
					</div>\
				</div>\
			</div>\
			<div class="ui-col ui-col-album">\
				<p class="ui-text ui-album-text overflow-style">'+page_list.value[i].AlbumName+'</p>\
			</div>\
			<div class="ui-col ui-col-play">\
				<img src="img/play_ico.png" class="ui-song-play-img" alt="" onclick="change_music('+i+')"/>\
			</div>\
			<div class="ui-col ui-col-download">\
				<img src="img/down_ico.png" class="ui-song-play-img" alt="" onclick="download_music('+i+')"/>\
			</div>\
			<div class="ui-col ui-col-time">\
				<p class="ui-text ui-time-text">'+ms_to_time(page_list.value[i].Duration)+'</p>\
			</div>\
		</div>';
	}
	//将html_code写入页面
	document.getElementById("search_res").innerHTML = html_code;
}
//刷新页码显示
function flush_pagenum_table()
{
	"use strict";
	var tail = '\
		<div class="ui-row ui-page-control">\
			<div class="ui-page-text">\
				<a href="javascript:;" class="ui-page-num';
	if(page_cur === 1){//第一页
		tail += ' cant-sel"';
	}
	else{
		tail += '" onclick="change_page_num(-1)"';
	}
	tail += '>上一页</a>';
	var page_count = Math.ceil(page_list.num / page_width);
	if(page_count <= 5){
		//总页码小于6，全部显示
		for(var i1=1; i1<=page_count; i1++){
			tail += '<a href="javascript:;" class="ui-page-num ';
			if(i1 === page_cur){
				tail += 'ui-this';
			}
			tail += '" onclick="change_page_num('+i1+')">'+i1+'</a>';
		}
	}
	else{
		//总页码大于5，需要显示省略号
		if(page_cur-3 <= 0){
			//当前页码小于等于3，前面不需要省略号，后面需要
			for(var i2=1; i2<=5; i2++){
				tail += '<a href="javascript:;" class="ui-page-num ';
				if(i2 === page_cur){
					tail += 'ui-this';
				}
				tail += '" onclick="change_page_num('+i2+')">'+i2+'</a>';
			}
			tail += '<span class="ui-page-num">...</span>'; 
		}
		else{
			//左边两个右边两个
			tail += '<span class="ui-page-num">...</span>';
			if(page_cur+2 < page_count){
				//当前页码左右都需要省略号
				for(var i3=page_cur-2; i3<=page_cur+2; i3++){
					tail += '<a href="javascript:;" class="ui-page-num ';
					if(i3 === page_cur){
						tail += 'ui-this';
					}
					tail += '" onclick="change_page_num('+i3+')">'+i3+'</a>';
				}
				tail += '<span class="ui-page-num">...</span>';
			}
			else{
				//左边显示省略号
				for(var i4=page_count-4;i4 <= page_count; i4++){
					tail += '<a href="javascript:;" class="ui-page-num ';
					if(i4 === page_cur){
						tail += 'ui-this';
					}
					tail += '" onclick="change_page_num('+i4+')">'+i4+'</a>';
				}
			}
		}
	}
	tail += '<a href="javascript:;" class="ui-page-num';
	if(page_cur*page_width > page_list.num){//最后一页
		tail += ' cant-sel"';
	}
	else{
		tail += '" onclick="change_page_num(0)"';
	}
	tail += '>下一页</a>\
			</div>\
		</div>';
	document.getElementById("page_num_area").innerHTML = tail;
}

function change_page_num(num)
{
	"use strict";
	if(num === -1){
		//上一页
		page_cur--;
	}
	else if(num === 0){
		page_cur++;
	}
	else{
		page_cur = num;
	}
	flush_pagenum_table();
	flush_music_list();
    window.scrollTo(0,0); //回到顶端
}

//将ajax获取的json数据进行页面重绘
function flush_page()
{
	"use strict";
	var time_total = 0;
	var ajax_timeout = setInterval(function(){
		if(page_list.status === 1){
			//ajax获取到了数据
			//渲染页面
			flush_music_list();
			page_cur = 1;
			flush_pagenum_table();			
			//重绘完成
			clearInterval(ajax_timeout);
			page_list.status = 0;
		}
		else{
			//ajax还没有获取到数据
			if(40 <= time_total++){
				clearInterval(ajax_timeout);
				alert("你的网络貌似不太好！");

			}
		}
	},500);
}

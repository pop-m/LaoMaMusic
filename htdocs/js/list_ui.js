// JavaScript Document
var show_play_list_status = 0;//0代表当前没有显示播放列表，1代表当前显示播放列表s
var rearrange_status = 0;//0代表没有点击调整顺序，1代表点击了调整顺序
var play_list_scroll_all_height;//播放列表滚动条的总高度
var mouse_y;
var play_list_scroll_start_top;//拖动滚动条的时候刚开始滚动条的top
var play_list_scroll_bar_height_bili;//滚动条所占滚动范围的百分比值

//显示和关闭播放列表
function showorclose_play_list(){
    "use strict";
    if(show_play_list_status === 0){
        //此时应该显示播放列表
        document.getElementById("play_list_content").style.display = "block";
        flush_play_list();
	    document.getElementById("scroll_bar").onmousedown = change_play_list;//拖动了播放列表的进度条
        show_play_list_status = 1;
    }else{
        //此时应该隐藏播放列表
        document.getElementById("play_list_content").style.display = "none";
        show_play_list_status = 0;
    }
}

var play_list = new Array();
function add_list(){
    for(var i=0; i<11; i++){
        var list_ele = {"music_name":"最炫民族风"+i,"music_src":"xxx","music_author":"凤凰传奇","img_src":"xxx","music_time":"240000"};
        play_list.push(list_ele);
    }
}
//重绘播放列表
function flush_play_list(){
    "use strict";
    for(var i =0; i<play_list.length; i++){
        var html_code = '\
                            <div class="play-list-row" onmouseover="play_list_over(this)" onmouseout="play_list_out(this)" onclick="play_list_play(num)"><!-- 一条 -->\
                                <div class="play-list-play-status"><!-- 播放状态 -->\
                                    '+ get_play_list_status(i) +'\
								</div>\
								<div class="play-list-songName"><!-- 歌曲名 -->\
									'+ play_list[i].music_name +'\
								</div>\
								<div class="play-list-singer"><!-- 演唱者 -->\
                                '+ play_list[i].music_author +'\
								</div>\
								<div class="play-list-time"><!-- 时间 -->\
                                '+ ms_to_time(parseInt(parseInt(play_list[i].music_time)/1000)) +'\
								</div>\
								<div class="play-list-selected-view"><!-- 选中时显示的按钮 -->\
									<div class="play-list-selected play-list-selected-collect" id="play_list_selected_collect" onclick="play_list_collect(' + i +')"><!-- 收藏 -->\
									</div>\
									<div class="play-list-selected play-list-selected-download" id="play_list_selected_download" onclick="play_list_download(' + i +')"><!-- 下载 -->\
									</div>\
									<div class="play-list-selected play-list-selected-remove" id="play_list_selected_remove" onclick="play_list_remove(' + i +')"><!-- 删除 -->\
									</div>\
								</div>\
								<div class="play-list-rearrange"><!-- 调整顺序按下之后显示 -->\
									<div class="play-list-up-down play-list-up" onclick="play_list_up(' + i +')">\
									</div>\
									<div class="play-list-up-down play-list-down" onclick="play_list_down(' + i +')">\
									</div>\
								</div>\
							</div>\
            ';
        document.getElementById("play_list_data_all").innerHTML += html_code;
    }
    //重绘滚动条
    if(play_list.length >= 11){
        document.getElementsByClassName("scroll-bar-div")[0].style.display = "block";
        get_play_list_scroll_data();
        document.getElementById("play_list_data_all").addEventListener("DOMMouseScroll", play_list_mousescroll,false);
        document.getElementById("play_list_data_all").onmousewheel = play_list_mousescroll;
    }else{
        document.getElementsByClassName("scroll-bar-div")[0].style.display = "none";
    }
}

function play_list_over(data){
    "use strict";
    data.className += " play-list-mouseon";
    if(rearrange_status == 0){
        data.getElementsByClassName("play-list-selected-view")[0].style.display = "block";
    }
}

function play_list_out(data){
    "use strict";
    //console.log(this.className);
    var class_name = data.className;
    data.className=class_name.replace(" play-list-mouseon","");
    data.getElementsByClassName("play-list-selected-view")[0].style.display = "none";
}

function play_list_click(){
    "use strict";
    console.log(this.value + "play");
}

//显示和关闭收藏列表
function showorclose_collect_list(){
    "use strict";
    console.log("show collect list");
}

function rearrange_button(dom){
    "use strict";
    if(rearrange_status === 0){
        //用户想要调整顺序
        dom.style.color = "red";
        dom.style.backgroundImage = 'url("/img/playListRearrangeSelect.png")';
        var list = document.getElementsByClassName("play-list-rearrange");
        for(var i=0; i<list.length; i++){
            document.getElementsByClassName("play-list-rearrange")[i].style.display = "block";
        }
        rearrange_status = 1;
    }else{
        //用户想要关闭调整顺序
        dom.style.color = "white";
        dom.style.backgroundImage = 'url("/img/playListRearrange.png")';
        var list = document.getElementsByClassName("play-list-rearrange");
        for(var i=0; i<list.length; i++){
            document.getElementsByClassName("play-list-rearrange")[i].style.display = "none";
        }
        rearrange_status = 0;
    }
}
function rearrange_mouseon(data){
    "use strict";
    data.style.color = "red";
    data.style.backgroundImage = 'url("/img/playListRearrangeSelect.png")';
    data.style.cursor = "pointer";
}
function rearrange_mouseout(data){
    "use strict";
    if(rearrange_status === 0){
        data.style.color = "white";
        data.style.backgroundImage = 'url("/img/playListRearrange.png")';
        data.style.cursor = "default";
    }
}

//根据播放列表的长度计算滚动条的高度
function get_play_list_scroll_data(){
    "use strict";
    var play_list_view_all_height = (play_list.length) * 30;
    play_list_scroll_bar_height_bili = parseInt(320 / parseInt(play_list_view_all_height) * 100);
    document.getElementById("scroll_bar").style.height = play_list_scroll_bar_height_bili + "%";
    
    var scroll_div_height = document.getElementById("scroll_bar").parentElement.style.height;
    play_list_scroll_all_height = parseInt(scroll_div_height.substring(0,scroll_div_height.length-2));
    
    change_play_list_view();
}

//当变动滚动条的位置的时候改变播放列表的显示
function change_play_list_view(){
    var scroll_bar_ele = document.getElementById("scroll_bar");
    var scroll_bar_top_bili = parseInt(scroll_bar_ele.style.top.substring(0,scroll_bar_ele.style.top.length-1));
    var play_list_all_top = (play_list.length) * 30 * scroll_bar_top_bili / 100;
    document.getElementById("play_list_data_all").style.top = "-" + play_list_all_top + "px";
}

//拖动播放列表的滚动条
function change_play_list(eve){
    "use strict";
    get_play_list_scroll_data();
	if(eve.button === 0){//鼠标左键
        mouse_y = eve.clientY;//获取鼠标的Y
        var scroll_bar_start = document.getElementById("scroll_bar").style.top;
        play_list_scroll_start_top = parseInt(scroll_bar_start.substring(0, scroll_bar_start.length-1));
		document.addEventListener('mousemove', play_list_scroll_move);//开始监听鼠标的移动事件
		document.addEventListener('mouseup', play_list_scroll_stop);//开始监听鼠标的松开事件
	}
}
function play_list_scroll_move(eve){
    "use strict";
    var diff_y = eve.clientY - mouse_y;
    var dif_y_b = diff_y / play_list_scroll_all_height;
    var result_top = parseInt(dif_y_b*100) + play_list_scroll_start_top;
    var limit_bottom = 100 - play_list_scroll_bar_height_bili;
    if(result_top <= 0){
        result_top = 0;
    }else if(result_top >= limit_bottom){
        result_top = limit_bottom;
    }
    document.getElementById("scroll_bar").style.top = result_top + "%";
    change_play_list_view();
}
function play_list_scroll_stop(eve){
    "use strict";
    document.removeEventListener("mousemove", play_list_scroll_move);
    document.removeEventListener("mouseup", play_list_scroll_stop)
}

function play_list_mousescroll(eve){
    "use strict";
    eve.cancelBubble=true;
    eve.returnValue = false;
    if (eve.wheelDelta) {  //判断浏览器IE，谷歌滑轮事件
        var scroll_bar_start = document.getElementById("scroll_bar").style.top;
        var play_list_scroll_start_top = parseInt(scroll_bar_start.substring(0, scroll_bar_start.length-1));
        var dif_y_b = ((eve.wheelDelta/10) / play_list_scroll_all_height) * (-1);
        var result_top = parseInt(dif_y_b*100) + play_list_scroll_start_top;
        console.log(result_top);
        var limit_bottom = 100 - play_list_scroll_bar_height_bili;
        if(result_top <= 0){
            result_top = 0;
        }else if(result_top >= limit_bottom){
            result_top = limit_bottom;
        }
        document.getElementById("scroll_bar").style.top = result_top + "%";
        change_play_list_view();
    } else if (e.detail) {  //Firefox滑轮事件  
        console.log(eve.detail);
    }  
}

//移除播放列表中下标为num的歌曲
function play_list_remove(num){
    "use strict";
}
//下载播放列表中下标为num的歌曲
function play_list_download(num){
    "use strict";
}
//收藏播放列表中下标为num的歌曲
function play_list_collect(num){
    "use strict";
}
//向上调整播放列表中下标为num的歌曲
function play_list_up(num){
    "use strict";
}
//向下调整播放列表中下标为num的歌曲
function play_list_down(num){
    "use strict";
}
//播放播放列表中下标为num的歌曲
function play_list_play(num){
    "use strict";
}
//播放列表中下标为num的歌曲是否正在播放，是则返回▶，不是则返回空字符串
function get_play_list_status(num){
    "use strict";
    return '►';
}
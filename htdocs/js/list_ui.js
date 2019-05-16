// JavaScript Document
var show_play_list_status = 0;//0代表当前没有显示播放列表，1代表当前显示播放列表s
function showorclose_play_list(){
    "use strict";
    if(show_play_list_status === 0){
        //此时应该显示播放列表
        document.getElementById("play_list_content").style.display = "block";
        show_play_list_status = 1;
    }else{
        //此时应该隐藏播放列表
        document.getElementById("play_list_content").style.display = "none";
        show_play_list_status = 0;
    }
}

function flush_play_list(){
    "use strict";
    
}

function show_collect_list(){
    "use strict";
    console.log("show collect list");
}
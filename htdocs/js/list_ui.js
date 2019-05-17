// JavaScript Document
var show_play_list_status = 0;//0代表当前没有显示播放列表，1代表当前显示播放列表s
var rearrange_status = 0;//0代表没有点击调整顺序，1代表点击了调整顺序

//显示和关闭播放列表
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

//重绘播放列表
function flush_play_list(){
    "use strict";
    
}

function play_list_over(data){
    "use strict";
    //this.className += "play-list-mouseon";
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
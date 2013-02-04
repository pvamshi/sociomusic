// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.
//
// WARNING: THE FIRST BLANK LINE MARKS THE END OF WHAT'S TO BE PROCESSED, ANY BLANK LINE SHOULD
// GO AFTER THE REQUIRES BELOW.
//
//= require jquery
//= require jquery_ujs
//= require_tree .
$(document).ready(function(){
    var files = null;
    var fileObjs = new Array();
    var valid_formats = ['mp3'];
    var current_song_number = 0;
    var songOrder = new Array();
    var playList = new Array();
    var playListSize = 0;
    var shuffled = false;
    var shuffledList = new Array();
    var as;



    //    int[] songOrder ; //= new int[5];
    document.querySelector("input[type='file']").onchange = function(e) {
        var iterator = playListSize-1;
        if(iterator == -1){
            $('#list').append('<ul/>');
        }
        for (var i = 0, f; f = e.target.files[i]; ++i) {
            var fileName = f.name;
            if(!(getFileFormat(f)==='mp3')){
                continue;
            }
            iterator++;
            $('#list ul').append('<li class="thumb" id="'+'fil'+iterator+'"><a>'+f.name +'</a></li>');
            fileObjs[iterator]= {};
            fileObjs[iterator].duri = createObjectURL(f);
            playListSize++;
        }
        $("#player").html('<audio id="song"  src="" preload="auto"  > </audio><br/ >');
        createPlayList();
        $('#btns').show();       
    	as = audiojs.createAll();
  		
        playSong(current_song_number);
    };
    var getFileFormat = function(f){
        if(f.type === 'audio/mp3' || f.type === 'audio/mpeg'){
            return "mp3";
        }
        return "none";
    }
    $(document).on('click','.thumb',function(){
        var idNum = parseInt($(this).attr('id').split('fil')[1]);
        playSong(idNum);
    });

    var playSong = function(num){
        if(current_song_number != -1){
            $('#fil'+current_song_number).removeClass('playing');
        }
        current_song_number = num;

        var sng = fileObjs[num].duri;
        $("#song").attr('src',sng);
        $("#song").innerHTML = "<source src= "+ sng+">"
        var song = $("#song")[0];
        audioplayer = as[0];
	    audioplayer.play();
		

        //as[0].play();
        song.addEventListener('ended',function(){
            $('#fil'+num).removeClass('playing');
            playSong(playList[num].nextSong);
        });
        $('#fil'+num).addClass('playing');
    };

    var  createObjectURL = function(file){
	    if ( window.webkitURL ) {
	        return window.webkitURL.createObjectURL( file );
	    } else if ( window.URL && window.URL.createObjectURL ) {
	        return window.URL.createObjectURL( file );
	    } else {
	        return null;
	    }
	}

    $('#shuf').click(function(){
        shuffled = !shuffled ;
        createPlayList();
        if(shuffled){
            $('#shuf').addClass('enabled');
        }else{
            $('#shuf').removeClass('enabled');
        }
    });

    $('#prev').click(function(){
        var prevSong = playList[current_song_number].previousSong;
        playSong(prevSong);
    });
    $('#next').click(function(){
        var nextSong = playList[current_song_number].nextSong;
        playSong(nextSong);
    });
    var createPlayList = function(){
        var tempArray = new Array();
        for(var i = 0; i < playListSize; i++){
            tempArray[i] = i;
            playList[i]={};
        }
        if(shuffled){
            for(var j = 0 ; j < playListSize; j++){
                var x = Math.floor(Math.random()*tempArray.length);
                var n = tempArray.splice(x,1)[0];
                playList[j].nextSong= n;
                playList[n].previousSong = j;
            }
        }else{
            playList[0].nextSong = 1;
            playList[0].previousSong = playListSize -1;
            for(var j = 1 ; j < playListSize-1; j++){
                playList[j].nextSong = j+1;
                playList[j].previousSong = j -1;
            }
            playList[playListSize -1].nextSong = 0;
            playList[playListSize -1].previousSong = playListSize -2;
        }
    }
});

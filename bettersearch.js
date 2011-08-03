(function(){
	var apiFunction = null;
	
	var chatProps = ['main',
                    'flushUnsentMessages',
                    'setSocketAddr',
                    'initIdleChecker',
                    'idleTime',
                    'checkIdle',
                    'socketReconnected',
                    'pingSocket',
                    'closeSocket',
                    'addEventListener',
                    'removeEventListener',
                    'dispatchEvent',
                    'addIdleListener',
                    'removeIdleListener',
                    'setPage',
                    'reloadPage',
                    'hashMod',
                    'getHashedAddr',
                    'whenSocketConnected',
                    'messageReceived',
                    'randomRoom',
                    'showWelcome',
                    'die',
                    'showAlert',
                    'showOverlay',
                    'hideOverlay',
                    'serverNow',
                    'seedPRNG',
                    'getSetting',
                    'setSetting'];

	//Attempt to get the API function by the process of elimination
	for(var key in turntable){
        var prop = turntable[key];
        
        if(typeof(prop) !== 'function'){ continue; }
        
        var inArray = false;
        
        for(var index in chatProps){
            var funcName = chatProps[index];
            
            if(key == funcName){ inArray = true; }
        }     
        
        if(!inArray){
            apiFunction = prop;
            
            break;
        }   
    }
	
	//Did we do good?
	if(apiFunction == null){
		alert('Couldn\'t Find the API Function');
		return;
	}
    
	//Build and style the search overlay
    var searchBox = $('<div class="overlay" style="position: fixed">\
	<div id="fl-search-container" class="modal">\
		<div class="close-x"></div>\
		<div id="fl-overflow" style="overflow: auto; height: 400px">\
			<div id="fl-results"><h3 id="fl-waiting"><br/>Enter your search above</h3></div>\
		</div>\
	</div>\
	</div>');
	
    var searchInput = $('<form id="fl-search-form" onsubmit="return false"><input type="text" placeholder="Search.." /></form>');
    
    searchInput.find('input').css({
        width: '92%',
        padding: '5px',
        marginTop: '35px'
    }).keyup(function(e){
		e.preventDefault();
		
		if(e.keyCode !== 13){
			return;
		}
		
		var search = $(this).val();
		
		if(!search.replace(/ /g,'').length){
			alert('Enter a search');
			return;
		}
		
		$('#fl-results .album').remove();
		$('#fl-results').find('h3#fl-waiting').text('Searching...');
		
		apiFunction({
	        api: "file.search",
	        query: search
	    }, function () {
	        turntable.addEventListener("message", handleSearch);
	    });
 
	});

    searchBox.css({
        padding: '10px'  
    }).find('#fl-search-container').css({
        position: 'fixed',
        zIndex: '5000',
        height: '500px',
        width: '600px',
        top: '10%',
        left: '50%',
        marginLeft: '-300px',
        padding: '10px',
        overflow: 'auto'
    }).find('#fl-overflow').before(searchInput);
    
    searchBox.find('.close-x').click(function(e){
        e.preventDefault();
		turntable.playlist.previewStop();
		
        searchBox.remove();
    });

   	$('.overlay').remove();

    if(!$('#fl-search-container').length){
        $('body').append(searchBox);
    }
   
   function handleSearch(res){
		$('#fl-results .album').remove();

        if(!res.success || !res.docs.length){
			$('#fl-results').find('h3').text('Could not find any results');
			return;
        }
		
       	$('#fl-results').find('h3').remove();
        
        var results = res.docs;
		
        turntable.removeEventListener("message", handleSearch);
			
 		var albums = {};

        for(var i = 0; i < results.length; i++){
            var result = results[i];
            var data = result.metadata;

            var album = data.album;
            
			if(!albums[album]){
				albums[album] = {
					art: data.coverart,
					artist: data.artist,
					songs: []
				};
			}
			
			albums[album]['songs'].push({
				fileId: result._id,
				song: data.song,
				duration:  Math.floor(data.length / 60) + ":" + String(data.length % 60 + 100).substr(1),
				d: data
			});
        }
		
		for(var album in albums){
			var info = albums[album];
			var songs = info.songs;
					
			var albumHTML = $('\
			<div class="album">\
				<img src="' + info.art + '" alt="' + info.artist + '" />\
				<div style="float: left; width: 70%">\
				<h2>' + album + '</h2>\
				<h3>' + info.artist + '</h3>\
				<ul></ul>\
				</div>\
				<div style="clear: both"></div>\
			</div>\
			');
			
			albumHTML.css({
				textAlign: 'left',
				fontSize: '14px',
				marginTop: '15px'
			}).find('img').css({
				float: 'left',
				marginRight: '10px'
			}).parent().find('hr').css({
				marginTop: '15px',
				marginBottom: '15px'
			}).parent().find('h2').css({
				fontSize: '16px'
			}).parent().find('h3').css({
				fontSize: '14px',
				fontWeight: 'normal'
			}).parent();
			
			songs.forEach(function(song){
				var songHTML = $('<li>\
					<div class="addSong"></div>\
					<div class="playSample"></div>\
					<div class="pauseSample"></div>\
					<div class="song">(' + song.duration + ') ' + song.song + '</div>\
				</li>');
				
				songHTML.css({
					listStyle: 'none',
					marginTop: '5px',
					float: 'left',
					position: 'relative',
					color: '#333',
					textShadow: 'none',
					padding: '3px',
					width: '100%',
				});
				
				songHTML.find('.addSong').css({
					background: 'url(https://s3.amazonaws.com/static.turntable.fm/images/playlist/add_song_sprite.png)',
					cursor: 'pointer',
					height: '18px',
					width: '17px',
					float: 'left',
					marginRight: '5px',
				}).click(function(){
					 turntable.playlist.addSong({
               		 	fileId: song.fileId,
		                metadata: song.d
		            });
				});
				
				songHTML.find('.playSample').css({
					background: 'url("https://s3.amazonaws.com/static.turntable.fm/images/playlist/play_button_sprite.png") repeat scroll 0 -17px transparent',
					height: '17px',
					width: '10px',
					cursor: 'pointer',
					float: 'left',
					marginRight: '5px',
				}).click(function(){					
					if(!$(this).data('isPlaying')){
						$(this).data('isPlaying', true);
						
						turntablePlayer.samplePlay(song.fileId, function(command, percent){												
							if(command == 'stop'){
								$(this).data('isPlaying', false);
							}
						});
					}
					else{
						$(this).data('isPlaying', false);
						turntablePlayer.sampleStop();
					}
				});
				
				songHTML.find('.song').css({
					//Doing something here
				});
				
				albumHTML.find('ul').append(songHTML);
			});
			
			$('#fl-results').append(albumHTML);
		}		
   }
})();

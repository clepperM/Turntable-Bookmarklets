(function(){
    var botAutoAwesomeTimer = null;
    var botCountdownTimer = null;
    var botInterval = 2.5 * 60 * 1000;
    
    var ttObj = null;
    
    for (var prop in window) { 
        if (window.hasOwnProperty(prop) && window[prop] instanceof roommanager){ 
            ttObj = window[prop];
            break;
        } 
    }

	if(ttObj === null){
		alert('Couldn\'t auto find the roommanger object.');
		return;
	}
	
	var botMessage = $('<div id="bot-message"><span>Waiting for first run..</span><br/><br/><a href="#" style="color: #FFF">Stop the bot</a></div>');
    botMessage.css({
        position: 'fixed',
        background: "rgba(0, 0, 0, 0.8)",
        color: 'white',
        fontSize: '14px',
        width: '200px',
        top: '20px',
        left: '50%',
        marginLeft: '-100px',
        zIndex: '5000',
        textAlign: 'center',
        padding: '10px'
    });
    
    if(!$('#bot-message').length){
        $('body').append(botMessage);
        
        botMessage.find('a').click(function(e){
            e.preventDefault();
            
            clearInterval(botAutoAwesomeTimer);
            botAutoAwesomeTimer = null;
            
            clearInterval(botCountdownTimer);
            botCountdownTimer = null;
            
            botMessage.remove();
        });
    }
    
    function danceParty(){        
        clearInterval(botCountdownTimer);
        botCountdownTimer = null;
        
        var botCountdownFrom = botInterval / 1000;    
        var botRandomIndex = Math.floor(Math.random() * botChatMessages.length);    
        var botChatMessage = botChatMessages[botRandomIndex] || null;
        
        ttObj.callback('upvote'); 
        
        if(botChatMessage !== '' && botChatMessage){
            chatFunction({
            	api: "room.speak",
            	roomid: TURNTABLE_ROOMID,
            	text: botChatMessage
            });
        }
        
        botCountdownTimer = setInterval(function(){
            if(botCountdownFrom <= 0){ botCountdownFrom = botInterval / 1000; }
            
            botMessage.find('span').html('Autoawesome in%20' + botCountdownFrom + '%20seconds');
            
            botCountdownFrom--;
        }, 1000);
    }
    
    var botAutoAwesomeTimer = setInterval(function(){        
        danceParty();
    }, botInterval);
})();
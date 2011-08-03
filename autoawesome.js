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
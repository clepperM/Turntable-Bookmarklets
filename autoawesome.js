(function(){
    var botAutoAwesomeTimer = null;
    var botCountdownTimer = null;
    var running = true;
    var botInterval = 2.5 * 60 * 1000;
    
    var ttObj = null;
    var chatFunction = null;
    
    for (var prop in window) { 
        if (window.hasOwnProperty(prop) && window[prop] instanceof roommanager) { 
            ttObj = window[prop];
            break;
        } 
    }
    
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

    for(var key in turntable){
        var prop = turntable[key];
        
        if(typeof(prop) !== 'function'){ continue; }
        
        var inArray = false;
        
        for(var index in chatProps){
            var funcName = chatProps[index];
            
            if(key == funcName){ inArray = true; }
        }     
        
        if(!inArray){
            chatFunction = prop;
            
            break;
        }   
    }
    
    var botChatMessages = [
        "Holy fuck, this song rocks so much! AWESOMED'd!",
        "If this were a person I would smell it's hair. Awesomed!",
        "What were you thinking? Cause THIS. IS. AWESOME!",
        "I like the way your breasts look. +1",
        "I'm a bot, and this is what I was designed to do, Awesome++",
        "'Member that time you did that thing for me? AWESOMED!",
        "This song.. Man it brings me back.",
        "",
    ];
    
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
        if(!running){ return; }
        
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
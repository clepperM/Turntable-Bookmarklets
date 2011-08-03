(function(){
    var botAutoAwesomeTimer = null;
    var botCountdownTimer = null;
    var botInterval = 2.5 * 60 * 1000;
    
    var ttObj = null;
    
	//Attempt to find the room manager object
    for (var prop in window) { 
        if (window.hasOwnProperty(prop) && window[prop] instanceof roommanager){ 
            ttObj = window[prop];
            break;
        } 
    }
	
	//Did we do good?
	if(ttObj === null){
		alert('Couldn\'t auto find the roommanger object.');
		return;
	}
	
	var botMessage = $('<div id="bot-message"><span>Starting Up..</span><br/><br/><a href="#" style="color: #FFF">Stop the bot</a></div>');
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

	//Append the bot message overlay
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
    
	//Update the message countdown timer
	function countdown(first){
		first = first || '';
		
		var botCountdownFrom = botInterval / 1000;   
		botCountdownTimer = null;
		
		botCountdownTimer = setInterval(function(){
            if(botCountdownFrom <= 0){ botCountdownFrom = botInterval / 1000; }
            
            botMessage.find('span').html(first + 'Autoawesome in ' + botCountdownFrom + ' seconds');
            
            botCountdownFrom--;
        }, 1000);	
	}
	
	//Trigger the upvote
    function danceParty(){        
        clearInterval(botCountdownTimer);
        
        ttObj.callback('upvote'); 
        
        countdown();
    }
    
	//Kick off the timer
	countdown('First ');
	
	//Start the awesome timer
    var botAutoAwesomeTimer = setInterval(function(){        
        danceParty();
    }, botInterval);
})();
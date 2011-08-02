/*
Bookmarklet

javascript:(function(){var checkEvery=1*1000;var ttObj=null;var botTimer=null;var waitingBox=$('<div id="bot-waiting-box">Waiting for a DJ Spot to open up</div>');waitingBox.css({position:'fixed',background:"rgba(0,0,0,0.8)",color:'white',fontSize:'14px',width:'200px',top:'20px',left:'50%',marginLeft:'-100px',zIndex:'5000',textAlign:'center',padding:'10px'});if(!$('#bot-waiting-box').length){$('body').append(waitingBox);}for(var prop in window){if(window.hasOwnProperty(prop)&&window[prop]instanceof roommanager){ttObj=window[prop];break;}}if(!ttObj){alert('Couldn\'t Auto find the roommanager object');return;}var myUID=ttObj.myuserid;if(myUID in ttObj.djs_uid){alert('You are already DJing');waitingBox.remove().hide();clearInterval(botTimer);botTimer=null;return;}function objLength(obj){var len=0;for(var key in obj){len++;}return len;}botTimer=setInterval(function(){if(objLength(ttObj.djs_uid)<5){ttObj.callback("become_dj",ttObj.become_dj.data("spot"));if(myUID in ttObj.djs_uid){clearInterval(botTimer);botTimer=null;waitingBox.hide().remove();alert('You\'re now DJing');}}},checkEvery);})();

*/

/** Actual Source **/
(function(){
	var checkEvery = 1 * 1000;
	var ttObj = null;
    var botTimer = null;
    
    var waitingBox = $('<div id="bot-waiting-box">Waiting for a DJ Spot to open up</div>');
    waitingBox.css({
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
    
    if(!$('#bot-waiting-box').length){
        $('body').append(waitingBox);
    }
    
    for (var prop in window) { 
        if (window.hasOwnProperty(prop) && window[prop] instanceof roommanager) { 
            ttObj = window[prop];
            break;
        } 
    }
    
    if(!ttObj){ alert('Couldn\'t Auto find the roommanager object'); return; }
    
    var myUID = ttObj.myuserid;
    
    if(myUID in ttObj.djs_uid){ 
        alert('You are already DJing');
        waitingBox.remove().hide();
        
        clearInterval(botTimer);
        botTimer = null;
        
        return;
    }

    function objLength(obj){
        var len = 0;
        
        for(var key in obj){
            len++;
        }
        
        return len;
    }
    
    botTimer = setInterval(function(){        
        if(objLength(ttObj.djs_uid) < 5){
           ttObj.callback("become_dj", ttObj.become_dj.data("spot"));
           
           if(myUID in ttObj.djs_uid){
               clearInterval(botTimer);
               botTimer = null;
               
               waitingBox.hide().remove();
               
               alert('You\'re now DJing');
           }
        }
    }, checkEvery);
})();
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
	
	if(apiFunction == null){
		alert('Couldn\'t Find the API Function');
		return;
	}
	
	 apiFunction({
            api: "file.search",
            query: 'Dr. Dre'
        }, function () {
            turntable.addEventListener("message", function(results){
				if(!results.success){
				    alert('no results');
			    }
			    
				turntable.removeEventListener("message");
			});
        });

})();
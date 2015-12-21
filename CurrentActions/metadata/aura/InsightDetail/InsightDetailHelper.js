({
    registerServiceWorker : function() {
        var isPushEnabled = false;
        
        …
        
        window.addEventListener('load', function() {  
            var pushButton = document.querySelector('.js-push-button');  
            pushButton.addEventListener('click', function() {  
                if (isPushEnabled) {  
                    unsubscribe();  
                } else {  
                    subscribe();  
                }  
            });
            
            // Check that service workers are supported, if so, progressively  
            // enhance and add push messaging support, otherwise continue without it.  
            if ('serviceWorker' in navigator) {  
                navigator.serviceWorker.register('/service-worker.js')  
                .then(initialiseState);  
            } else {  
                console.warn('Service workers aren\'t supported in this browser.');  
            }  
        });
    }
})
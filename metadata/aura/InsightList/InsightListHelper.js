({
    //Fetch the insights from the Apex controller
    getInsightList: function(component) {
        var action = component.get("c.getInsights");

        //Set up the callback
        var self = this;
        action.setCallback(this, function(actionResult) {
            component.set("v.insights", actionResult.getReturnValue());
            window.scrollTo(0,0);
            //$("#ticket-event-list").accordion('activate', 0 );
            jQuery(".selector").accordion("option", {active: 0});

        });
        $A.enqueueAction(action);
    },

    getInsightAssocList: function(component, assoc_id) {

        var action = component.get("c.getInsightsWithAssociation");
        action.setParams({
            "assoc_id": assoc_id
        });

        //Set up the callback
        var self = this;
        action.setCallback(this, function(actionResult) {
            component.set("v.insights", actionResult.getReturnValue());
            window.scrollTo(0,0);

        });
        $A.enqueueAction(action);

        //
    },

    getInsightReportList: function(component, report_id) {

        //
        var action = component.get("c.getInsightsByReport");
        action.setParams({
            "report_id": report_id
        });

        //Set up the callback
        var self = this;
        action.setCallback(this, function(actionResult) {

            var result = actionResult.getReturnValue(); 
            console.log("setting new insights");
            component.set("v.insights", result);
            window.scrollTo(0,0);


        });
        $A.enqueueAction(action);

        //
    },

    getInsightTypeLabelList: function(component, label) {

        console.log("get insights for type label: "+label);

        //
        var action = component.get("c.getInsightsForTypeLabel");
        action.setParams({
            "labelID": label
        });

        //Set up the callback
        var self = this;
        action.setCallback(this, function(actionResult) {
            component.set("v.insights", actionResult.getReturnValue());
            window.scrollTo(0,0);

        });
        $A.enqueueAction(action);

        //
    },

    markUnread : function(component, event, helper) {
        var action = component.get("c.setInsightReadStatus");
        var insight = component.get("v.insight");
        action.setParams({
            "insight_id": insight.Id,
            "status" : true
        });

        //Set up the callback
        var self = this;
        action.setCallback(this, function(actionResult) {
            component.set("v.unread", true);
        });
        $A.enqueueAction(action);
    },


    clickInsight : function (component, index) {

        var insights = component.get("v.insights");
        var insight = insights[index];

        console.log(index+" Accordion selected: "+insight.Name);

        var selectEvent = $A.get("e.c:InsightEvent");
        selectEvent.setParams({ "insight": insight });
        selectEvent.fire();

    },

    registerServiceWorker : function() {

        console.log('REGISTER A SERVICE WORKER');

        var isPushEnabled = false;



//            console.log('load event listener');
       //     var pushButton = document.querySelector('.js-push-button');
         //   pushButton.addEventListener('click', function() {
        //        if (isPushEnabled) {
       //             unsubscribe();
         //       } else {
                   // subscribe();
         //       }
//});

            // Check that service workers are supported, if so, progressively
            // enhance and add push messaging support, otherwise continue without it.
            if ('serviceWorker' in navigator) {
                console.log('REGISTER SERVICE WORKER JS????');
                navigator.serviceWorker.register('/service-worker.js')
                .then(this.initialiseState());
            } else {
                console.log('Service workers aren\'t supported in this browser.');
            }
        },

    // Once the service worker is registered set the initial state
    initialiseState : function () {
        // Are Notifications supported in the service worker?
        if (!('showNotification' in ServiceWorkerRegistration.prototype)) {
            console.warn('Notifications aren\'t supported.');
            return;
        }

        // Check the current Notification permission.
        // If its denied, it's a permanent block until the
        // user changes the permission
        if (Notification.permission === 'denied') {
            console.warn('The user has blocked notifications.');
            return;
        }

        // Check if push messaging is supported
        if (!('PushManager' in window)) {
            console.warn('Push messaging isn\'t supported.');
            return;
        }

        // We need the service worker registration to check for a subscription
        navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
            // Do we already have a push message subscription?
            serviceWorkerRegistration.pushManager.getSubscription()
            .then(function(subscription) {
                // Enable any UI which subscribes / unsubscribes from
                // push messages.
                var pushButton = document.querySelector('.js-push-button');
                pushButton.disabled = false;

                if (!subscription) {
                    // We aren't subscribed to push, so set UI
                    // to allow the user to enable push
                    return;
                }

                // Keep your server in sync with the latest subscriptionId
                sendSubscriptionToServer(subscription);

                // Set your UI to show they have subscribed for
                // push messages
                pushButton.textContent = 'Disable Push Messages';
                isPushEnabled = true;
            })
            .catch(function(err) {
                console.warn('Error during getSubscription()', err);
            });
        });
    },

    sampleControllerAction: function(cmp) {
        // subscribe to severity levels
        $A.logger.subscribe("INFO", logCustom);
        // Following subscriptions not exercised here but shown for completeness
        $A.logger.subscribe("WARNING", logCustom);
        $A.logger.subscribe("ASSERT", logCustom);
        $A.logger.subscribe("ERROR", logCustom);


        function logCustom(level, message, error) {
            console.log(getTimestamp(), "logCustom: ", arguments); 
        }

        function getTimestamp() {
            return new Date().toJSON();
        }
    }


})
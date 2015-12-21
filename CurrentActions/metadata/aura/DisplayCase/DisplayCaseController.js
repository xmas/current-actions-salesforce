({
	refreshCase : function(component) {
      // create a one-time use instance of the serverEcho action
        // in the server-side controller
        var action = component.get("c.getCaseFromId ");
        //action.setParams({ Id : "" });

        // Create a callback that is executed after 
        // the server-side action returns
        action.setCallback(this, function(response) {
            	debugger;


            var state = response.getState();
            // This callback doesn’t reference component. If it did,
            // you should run an isValid() check
            //if (component.isValid() && state === "SUCCESS") {
            if (state === "SUCCESS") {
				component.set("v.record", response.getReturnValue()); 
                //component.find("Subject").set("v.value", response.getReturnValue().Subject);
            }
            //else if (component.isValid() && state === "ERROR") {
            else if (state === "ERROR") {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log("Error message: " + 
                                 errors[0].message);
                    }
                } else {
                    console.log("Unknown error");
                }
            }
        });
        

        // optionally set abortable flag here

        // A client-side action could cause multiple events, 
        // which could trigger other events and 
        // other server-side action calls.
        // $A.enqueueAction adds the server-side action to the queue.
        $A.enqueueAction(action);
    }
})
({
	
	doInit : function(component, event, helper) {

         var action = component.get("c.getUserName");

        //Set up the callback
        var self = this;
        action.setCallback(this, function(actionResult) {

            var result = actionResult.getReturnValue(); 
            component.set("v.name", result);

        });
        $A.enqueueAction(action);
	},
	
	postScript : function(component, event, helper) {

		//var AWS;

	},


	assocSearch  : function(component, event, helper) {

		// var title = event.getParam("title");
		// component.set("v.title", title);
	}
})
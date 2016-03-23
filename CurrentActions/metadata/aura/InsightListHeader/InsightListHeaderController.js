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

        var data_action = component.get("c.getInsightCounts");
        data_action.setCallback(this, function(actionResult) {

            var result = JSON.parse(actionResult.getReturnValue()); 

            component.set("v.global_total", result.all_users.total);
            component.set("v.global_new_changed", result.all_users.changed+result.all_users.new);
            component.set("v.user_total", result.user.total);
            component.set("v.user_new_changed", result.user.changed+result.user.new);

        });
        $A.enqueueAction(data_action);


    },

    postScript : function(component, event, helper) {

		//var AWS;

	},


	assocSearch  : function(component, event, helper) {

		// var title = event.getParam("title");
		// component.set("v.title", title);
	}
})
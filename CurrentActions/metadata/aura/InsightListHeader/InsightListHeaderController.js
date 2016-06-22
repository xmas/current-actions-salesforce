({

	doInit : function(component, event, helper) {


        //Set up the callback
        var self = this;
        var name_action = component.get("c.getUserName");
        name_action.setCallback(this, function(actionResult) {

        	var result = actionResult.getReturnValue();
        	component.set("v.name", result);

        });
        $A.enqueueAction(name_action);

    },

    postScript : function(component, event, helper) {

    },

    assocSearch  : function(component, event, helper) {

    	var title = event.getParam("title");
    	component.set("v.title", title);
    },

    menu : function(component, event, helper) {
        //console.log(event.target);
        $("#nav-dropdown").toggleClass("slds-is-open");
    }
})
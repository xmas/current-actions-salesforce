({
	doInit: function(component, event, helper) {

		var action = component.get("c.getTypeData");

        //Set up the callback
        var self = this;
        action.setCallback(this, function(actionResult) {
        	component.set("v.typedata", actionResult.getReturnValue());            
        });
        $A.enqueueAction(action);
    }
})
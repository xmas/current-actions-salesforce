({
	getTypes : function(component) {
		var action = component.get("c.getTypeData");
        //Set up the callback
        var self = this;
        action.setCallback(this, function(actionResult) {
        	var data = JSON.parse(actionResult.getReturnValue())
        	component.set("v.typedata", data);
            component.set("v.typedata-base", data);

        });
        $A.enqueueAction(action);
    },

    getReports : function(component) {
    	var action = component.get("c.getReports");
        //Set up the callback
        var self = this;
        action.setCallback(this, function(actionResult) {
        	component.set("v.reports", actionResult.getReturnValue());
            component.set("v.reports-base", actionResult.getReturnValue());
        });
        $A.enqueueAction(action);
    }
})
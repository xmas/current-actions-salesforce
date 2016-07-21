({
    
    //Fetch the insights from the Apex controller
    doInit : function(component, event, helper) {
        var action = component.get("c.getInsightsForRecord");
        action.setParams({
            "recordID": component.get("v.recordId")
        });
        console.log(component.get("v.recordId"));

        //Set up the callback
        var self = this;
        action.setCallback(this, function(actionResult) {
            
            console.log(actionResult.getReturnValue());
            component.set("v.insights", actionResult.getReturnValue());            
        });
        $A.enqueueAction(action);
    },
    
})
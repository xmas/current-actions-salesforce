({

    getSources : function(component) {

        console.log('helper getReports');
        var action = component.get("c.getSources");
        //Set up the callback
        var self = this;
        action.setCallback(this, function(actionResult) {
            console.log('setting reports to base');

            component.set("v.sources", actionResult.getReturnValue());
        });
        $A.enqueueAction(action);
    }

})
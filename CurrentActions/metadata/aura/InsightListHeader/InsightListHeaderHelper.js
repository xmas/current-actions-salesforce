({
    getTypes : function(component) {
        var action = component.get("c.getTypeData");
        //Set up the callback
        var self = this;
        action.setCallback(this, function(actionResult) {
            var data = JSON.parse(actionResult.getReturnValue())
            console.log('setting types to base');
            console.log(data);

            component.set("v.typedata", data);
            component.set("v.typedata-base", data);

        });
        $A.enqueueAction(action);
    },

    getReports : function(component) {

        console.log('helper getReports');
        var action = component.get("c.getReports");
        //Set up the callback
        var self = this;
        action.setCallback(this, function(actionResult) {
            console.log('setting reports to base');

            component.set("v.reports", actionResult.getReturnValue());
            component.set("v.reports-base", actionResult.getReturnValue());
        });
        $A.enqueueAction(action);
    },

    getTypeLabels : function(component) {

        console.log('helper getReports');
        var action = component.get("c.getTypeLabels");
        //Set up the callback
        var self = this;
        action.setCallback(this, function(actionResult) {
            console.log('setting reports to base');

            component.set("v.typelabels", actionResult.getReturnValue());
            component.set("v.typelabels-base", actionResult.getReturnValue());
        });
        $A.enqueueAction(action);
    }


})
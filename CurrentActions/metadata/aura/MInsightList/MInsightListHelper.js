({
    //Fetch the insights from the Apex controller
    getInsightList: function(component) {
        var action = component.get("c.getInsights");

        //Set up the callback
        var self = this;
        action.setCallback(this, function(actionResult) {
            component.set("v.insights", actionResult.getReturnValue());
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
        });
        $A.enqueueAction(action);

        //
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
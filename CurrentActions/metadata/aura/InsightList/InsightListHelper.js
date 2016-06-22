({
    //Fetch the insights from the Apex controller
    getInsightList: function(component) {
        var action = component.get("c.getInsights");

        //Set up the callback
        var self = this;
        action.setCallback(self, function(actionResult) {
            component.set("v.insights", actionResult.getReturnValue());
            window.scrollTo(0,0);
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
        action.setCallback(self, function(actionResult) {
            component.set("v.insights", actionResult.getReturnValue());
            window.scrollTo(0,0);

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
        action.setCallback(self, function(actionResult) {

            var result = actionResult.getReturnValue();
            console.log("setting new insights");
            component.set("v.insights", result);
            window.scrollTo(0,0);


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
        action.setCallback(self, function(actionResult) {
            component.set("v.insights", actionResult.getReturnValue());
            window.scrollTo(0,0);

        });
        $A.enqueueAction(action);

        //
    },

    markUnread : function(component, event, helper) {
        var action = component.get("c.setInsightReadStatus");
        var insight = component.get("v.insight");
        action.setParams({
            "insight_id": insight.Id,
            "status" : true
        });

        //Set up the callback
        var self = this;
        action.setCallback(this, function(actionResult) {
            component.set("v.unread", true);
        });
        $A.enqueueAction(action);
    },


    clickInsight : function (component, index) {

        var insights = component.get("v.insights");
        var insight = insights[index];

        console.log(index+" Accordion selected: "+insight.Name);

        var selectEvent = $A.get("e.c:InsightEvent");
        selectEvent.setParams({ "insight": insight });
        selectEvent.fire();

    }

})
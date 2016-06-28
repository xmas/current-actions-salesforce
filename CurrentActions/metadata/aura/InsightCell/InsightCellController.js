({

    doInit : function(component, event, helper) {
        _.defer(function () {
            helper.historyChart(component, event, helper);
       });

        var insight = component.get("v.insight");
        if (insight) {
            if (insight.Parent_Type__c === 'all' && insight.Child_Type__c === "group") {
                component.set("v.grouping", " grouped by ");
            }
            else if (insight.Parent_Type__c === 'group' && insight.Child_Type__c === "leaf") {
                component.set("v.grouping", " where ");
            }
        }

    },

     postScript : function(component, event, helper) {

        helper.setRelativeTime(component, event, helper);
        helper.loadChart(component, event, helper);

    },

    showModal : function(component, event, helper) {

        var modalCloseEvent = $A.get("e.c:modalOpen");
        var insight = component.get("v.insight");

        modalCloseEvent.setParams({modal_open: insight});
        modalCloseEvent.fire();
    },

    openObject : function(component, event, helper) {
        var navEvt = $A.get("e.force:navigateToSObject");
        navEvt.setParams({
            "recordId": "v.insight.id",
            "slideDevName": "chatter"
        });
        navEvt.fire();
    },

    markUnread : function(component, event, helper) {
       var action = component.get("c.setInsightReadStatus");
       var insight = component.get("v.insight");

       action.setParams({
        "insight_id": insight.Id,
        "status" : false
    });

        //Set up the callback
        var self = this;
        action.setCallback(this, function(actionResult) {
            component.set("v.unread", true);
        });
        $A.enqueueAction(action);
    },

    sendSelectedInsight : function(component, event, helper) {

        var insight = component.get("v.insight");
        console.log("got the insight: "+insight);
        var insightEvent = $A.get("e.c:selectInsight");
        insightEvent.setParams({"insight": insight});
        insightEvent.fire();

    },


    navToMyComp : function(component, event, helper) {
        var evt = $A.get("e.force:navigateToComponent");
        evt.setParams({
            componentDef: "c:InsightDetail",
            componentAttributes: {
                insight: component.get("v.insight")
            }
        });
        evt.fire();
    },
})
({

    doInit : function(component, event, helper) {




    },

     postScript : function(component, event, helper) {

        helper.setRelativeTime(component, event, helper);
        helper.loadChart(component, event, helper);

          var insight = component.get("v.insight");

        var count = insight.Today_Changed__c;
        if (count > 1) {
            count = count + '</strong> signficant items.';
        } else if ( count === 0) {
            count = 'no</strong> signficant items.';
        } else {
            count = '1</strong> signficant item.';
        }

        var title = '';
        if (insight.Parent_Type__c === 'all' && insight.Child_Type__c === 'leaf') {
                title = 'The <strong>'+insight.Field_Labels__c+'</strong> for all <strong>'+insight.Data_Source__c+'</strong> has <strong>'+count;
        }
        if (insight.Parent_Type__c === 'group' && insight.Child_Type__c === 'leaf') {
            title = 'The <strong>'+insight.Field_Labels__c+'</strong> where <strong>'+insight.Parent_Label__c+'</strong> is <strong>'+insight.Child_Label__c+'</strong> in <strong>'+insight.Data_Source__c+'</strong> has <strong>'+count;
        }
        if (insight.Parent_Type__c === 'group' && insight.Child_Type__c === 'group') {
            title = 'The <strong>'+insight.Field_Labels__c+'</strong> where <strong>'+insight.Child_Label__c+'</strong> in <strong>'+insight.Data_Source__c+'</strong> has <strong>'+count;
        }
        component.set("v.title", title);

        _.defer(function () {
            $A.getCallback(function() {
                helper.historyChart(component, event, helper);
            });
        });

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
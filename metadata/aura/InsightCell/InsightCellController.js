({
    postScript : function(component, event, helper) {
        var fullinit = component.get("v.fullinit");
        if (fullinit) {
            helper.chartjs(component, event, helper);
        } else {
            component.set("v.fullinit", 'true');
        }


    },

    doInit : function(component, event, helper) {

        //var modal = component.find("modal");
        //console.log("toggle" + modal);
        //$A.util.toggleClass(modal, "toggle");
        var insight = component.get("v.insight");
        helper.assignIcon(component, insight);
        //helper.getDataFromS3(component, insight);

        var fullinit = component.get("v.fullinit");
        if (fullinit) {
            helper.chartjs(component, event, helper);
        } else {
            component.set("v.fullinit", 'true');
        }

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

    OLDtoggleModal : function(component, event, helper) {
        $A.createComponent(
            "c:InsightModal",
            {
                "aura:id": "modal",
            },
            function(newModal){
                //Add the new button to the body array
                if (component.isValid()) {
                    var body = component.get("v.body");
                    body.push(newModal);
                    component.set("v.body", body);
                    newModal.set("v.parent", [component]);
                }
            }
            );
    },

    removeModal : function(component, event, helper) {

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
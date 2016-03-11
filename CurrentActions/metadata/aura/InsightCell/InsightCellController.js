({

    doInit : function(component, event, helper) {
        //var modal = component.find("modal");
        //console.log("toggle" + modal);
        //$A.util.toggleClass(modal, "toggle");
        var insight = component.get("v.insight");
        helper.assignIcon(component, insight);
        helper.getDataFromS3(component, insight);
    },

    toggleModal : function(component, event, helper) {
        $A.createComponent(
            "c:InsightModal",
            {
                "aura:id": "modal",
            },
            function(newModal){
                //Add the new button to the body array
                if (component.isValid()) {
                    component.set("v.modal", [newModal]);
                    //newModal.set("v.parent", [component]);
                }
            }
        );
    },

    closeModal : function(component, event, helper) {
        var insight = component.get("v.insight");
        console.log("MODAL CLOSE EVENT RECEIVED ON CELL WITH INSIGHT: "+insight.Long_Name__c);
        component.set("v.modal",[]);
    },

    openObject : function(component, event, helper) {
        var navEvt = $A.get("e.force:navigateToSObject");
        navEvt.setParams({
            "recordId": "v.insight.id",
            "slideDevName": "chatter"
        });
        navEvt.fire();
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
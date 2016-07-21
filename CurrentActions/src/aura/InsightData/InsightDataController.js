({
    close : function(component, event, helper) {
        console.log("TRIGGER THE CLOSE EVENT FROM THE MODAL");
        //debugger;
        var modalCloseEvent = $A.get("e.c:modalClose");
        modalCloseEvent.setParams({modal_close: "close"});
        modalCloseEvent.fire();
    },

    postScript : function(component, event, helper) {


    },

     doInit : function(component, event, helper) {

        //var insight = component.get("v.insight");
        //helper.getDataFromS3(component, event, helper, insight);

    },

})
({

     doInit : function(component, event, helper) {

        // var insight = component.get("v.insight");
        // helper.getDataFromS3(component, event, helper, insight);

    },

    postScript : function(component, event, helper) {

        var insight = component.get("v.insight");
        helper.getDataFromS3(component, event, helper, insight);

    }

})
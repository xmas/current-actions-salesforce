({

    postScript : function(component, event, helper) {

        var insight = component.get("v.insight");
        helper.getDataFromS3(component, event, helper, insight);

    },


     doInit : function(component, event, helper) {

        var insight = component.get("v.insight");
        console.log(insight);

    },

})
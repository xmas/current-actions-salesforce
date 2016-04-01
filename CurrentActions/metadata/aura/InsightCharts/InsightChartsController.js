({
  
    postScript : function(component, event, helper) {

    
    },

     doInit : function(component, event, helper) {

        var insight = component.get("v.insight");
        helper.getDataFromS3(component, event, helper, insight);

    },

})
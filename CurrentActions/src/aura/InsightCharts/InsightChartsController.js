({

     doInit : function(component, event, helper) {

        console.log("InsightsChart init");
    },

    postScript : function(component, event, helper) {

        var insight = component.get("v.insight");
        console.log('InsightsChartController; insight set on chart:');
        console.log(insight);
        helper.getDataFromS3(component, event, helper, insight);

    }

})
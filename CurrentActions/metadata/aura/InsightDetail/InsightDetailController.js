({
    //Fetch the insights from the Apex controller
    doInit : function(component, event, helper) {
       // var action = component.get("c.getInsights");

       //  //Set up the callback
       //  var self = this;
       //  action.setCallback(this, function(actionResult) {
       //      var new_insight = [];
       //      new_insight.push(actionResult.getReturnValue()[0]);
       //      component.set("v.insights", new_insight);
       //      window.scrollTo(0,0);
       //  });
       //  $A.enqueueAction(action);

       console.log("InsightDetailController init");

       try {
        component.set("v.insights", []);
      } catch (err) {
        console.log('error on init for detail');
        console.log(err);
        console.log(err.stack);
      }

    },

    setSelectedInsight : function(component, event, helper) {

     // var result_err = new Error();
     // console.log(result_err.stack);

     var insight = event.getParam("insight");
     console.log("InsightDetailController set insight to:");
     console.log(insight);

     var new_insight = [];
     new_insight.push(insight);

     component.set("v.insights", new_insight);
     window.scrollTo(0,0);

  },

  tabClick :  function(component, event, helper) {
    $("#tab1, #tab2").toggleClass("slds-active");
    $("#tab-default-1, #tab-default-2").toggleClass("slds-show slds-hide");
}

})
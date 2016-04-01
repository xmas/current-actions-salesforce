({
    //Fetch the insights from the Apex controller
    doInit : function(component, event, helper) {
       var action = component.get("c.getInsights");

        //Set up the callback
        var self = this;
        action.setCallback(this, function(actionResult) {
            var new_insight = [];
            new_insight.push(actionResult.getReturnValue()[0]);
            component.set("v.insights", new_insight);
            window.scrollTo(0,0);
        });
        $A.enqueueAction(action);
    },

    setSelectedInsight : function(component, event, helper) {
        var insight = event.getParam("insight");
      var new_insight = [];
      new_insight.push(insight);
      console.log("insight set to: "+insight);

      component.set("v.insights", new_insight);
      window.scrollTo(0,0);

  }
})
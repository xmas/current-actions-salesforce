({
  doInit : function(component, event, helper) {

        //Fetch the insight list from the Apex controller
        helper.getInsightList(component);
        //helper.registerServiceWorker();
        helper.sampleControllerAction(component);
  },

  postScript: function(component, event, helper) {


  },


})
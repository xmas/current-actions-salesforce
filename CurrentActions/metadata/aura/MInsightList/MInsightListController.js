({
  doInit : function(component, event, helper) {

        //Fetch the insight list from the Apex controller
        helper.getInsightList(component, helper);
        //helper.registerServiceWorker();
        helper.sampleControllerAction(component);
  },

  postScript: function(component, event, helper) {


  },


  showPopup :  function(component, event, helper) {
    //called on clicking your button
    //run your form render code after that, run the following lines
    helper.showPopupHelper(component, 'modaldialog', 'slds-fade-in-');
    helper.showPopupHelper(component,'backdrop','slds-backdrop--');
    },

    hidePopup :  function(component, event, helper) {

    helper.hidePopupHelper(component, 'modaldialog', 'slds-fade-in-');
    helper.hidePopupHelper(component, 'backdrop', 'slds-backdrop--');
    }

})
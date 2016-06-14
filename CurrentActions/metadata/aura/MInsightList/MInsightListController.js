({
  doInit : function(component, event, helper) {

        //Fetch the insight list from the Apex controller
        helper.getInsightList(component, helper);
        //helper.registerServiceWorker();
        helper.sampleControllerAction(component);


  },

  postScript: function(component, event, helper) {

      // (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      // (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      // m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
      // })(window,document,'script','/resource/ga','ga');

      // ga('create', 'UA-78916410-1', 'auto');
      // ga('send', 'pageview');

  },


  showPopup :  function(component, event, helper) {
    //called on clicking your button
    //run your form render code after that, run the following lines
    helper.showPopupHelper(component, helper, 'modaldialog', 'slds-fade-in-');
    helper.showPopupHelper(component, helper, 'backdrop','slds-backdrop--');
    },

    hidePopup :  function(component, event, helper) {
      //debugger;
    helper.hidePopupHelper(component, helper, 'modaldialog', 'slds-fade-in-');
    helper.hidePopupHelper(component, helper, 'backdrop', 'slds-backdrop--');
    },

    showModalForInsight : function(component, event, helper) {
      //debugger;
     var insight = event.getParam("insight");
     helper.showPopupHelper(component, helper, 'modaldialog', 'slds-fade-in-', insight);
     helper.showPopupHelper(component, helper, 'backdrop','slds-backdrop--');

    }

})
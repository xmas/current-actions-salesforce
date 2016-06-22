({

   doInit : function(component, event, helper) {
      helper.logError(component);
   },

    postScript :  function(component, event, helper) {
        $('header-wrap');
        console.log('loaded scripts in app');
    }

})
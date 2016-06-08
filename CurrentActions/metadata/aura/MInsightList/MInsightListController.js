({
  doInit : function(component, event, helper) {

        //Fetch the insight list from the Apex controller
        helper.getInsightList(component, helper);
        //helper.registerServiceWorker();
        helper.sampleControllerAction(component);

        var oneHeader = document.getElementById('oneHeader');
        oneHeader.style.backgroundColor='#292731';
        oneHeader.style.transition = 0.5;

        var x = document.getElementsByClassName("toggleNav")[0];
        var sf1_color = x.style.color;
        component.set("v.sf1_color", sf1_color);
        x.addEventListener("click", function(){
          if (component.isValid()) {
            oneHeader.style.backgroundColor = component.get("v.sf1_color");
            document.getElementById('oneHeader').style.transition = 0.5;
          }
        });
  },

  postScript: function(component, event, helper) {

      (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
      })(window,document,'script','/resource/ga','ga');

      ga('create', 'UA-78916410-1', 'auto');
      ga('send', 'pageview');

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
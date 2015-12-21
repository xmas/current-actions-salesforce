({
    doInit : function(component, event, helper) {      
        //Fetch the insight list from the Apex controller   
        helper.getInsightList(component);
        //helper.registerServiceWorker();
    },
    
    subscribe : function (component, event, helper) {
        helper.registerServiceWorker();
    },
    
    myButtonHandler: function(component, event, helper) {
        //Get data via "data-data" attribute
        alert(event.target.getAttribute("data-data") + " was passed");
    },
    
    getInsight : function(component, event, helper) {
        var selected = event.getParam("insight");
        console.log(selected);
        var arr = component.get("v.selected");
        arr.push(selected);
        component.set("v.selected", arr);
    },
    
    openObject : function(component, event, helper) {
        var navEvt = $A.get("e.force:navigateToSObject");
        navEvt.setParams({
            "recordId": "a0E61000000q3Cv",
            "slideDevName": "chatter"
        });
        navEvt.fire();
    },
    
    

    toggleModal : function(component, event, helper) {
        $A.createComponent(
            "c:InsightModal",
            {
                "aura:id": "modal",
            },
            function(newModal){
                //Add the new button to the body array
                if (component.isValid()) {
                    var body = component.get("v.body");
                    body.push(newModal);
                    component.set("v.body", body);
                }
            }
        );
    }, 
    
    
 })
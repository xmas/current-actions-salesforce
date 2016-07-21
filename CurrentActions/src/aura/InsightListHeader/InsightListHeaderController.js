({

	doInit : function(component, event, helper) {


        try {
            var name_action = component.get("c.getUserName");
            name_action.setCallback(this, function(actionResult) {

               var result = actionResult.getReturnValue();
               component.set("v.name", result);

           });
            $A.enqueueAction(name_action);
        } catch (err) {
            console.log(err);
            console.log(err.stack);
        }


        try {
            var total_action = component.get("c.totalInsightCount");
            total_action.setCallback(this, function(actionResult) {
               var result = actionResult.getReturnValue();
               component.set("v.totalCount", result);
           });
            $A.enqueueAction(total_action);
        } catch (err) {
            console.log(err);
            console.log(err.stack);
        }


    },

    postScript :  function(component, event, helper) {
        helper.getSources(component, helper);
    },

    onChangeType : function(component, event, helper) {
        var filterSelect = component.find("filterSelect");
        var filter = filterSelect.get("v.value");
        var selectEvent = $A.get("e.c:AssocEvent");
        selectEvent.setParams({ "assocID": filter });
        selectEvent.fire();
    },

    countChange : function(component, event, helper) {
    	var count = event.getParam("count");
    	component.set("v.count", count);
    },

    assocSearch  : function(component, event, helper) {

    	var title = event.getParam("title");
    	component.set("v.title", title);
    },

    menu : function(component, event, helper) {
        //console.log(event.target);
        $("#nav-dropdown").toggleClass("slds-is-open");
    }
})
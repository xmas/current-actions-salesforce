({

    doInit : function(component, event, helper) {

        //Set up the callback
        var name_action = component.get("c.getUserName");
        name_action.setCallback(this, function(actionResult) {

            var result = actionResult.getReturnValue();
            component.set("v.name", result);

        });
        $A.enqueueAction(name_action);


        var total_action = component.get("c.totalInsightCount");
        total_action.setCallback(this, function(actionResult) {
            var result = actionResult.getReturnValue();
            component.set("v.totalCount", result);
        });
        $A.enqueueAction(total_action);

        helper.getSources(component);
    },

    postScript :  function(component, event, helper) {

        $('#source-option').change(function () {
            console.log('SOURCE SELECTION:'+$(this).val());
        });


        $('#value-option').change(function () {
            console.log('VALUE SELECTION:'+$(this).val());
        });

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
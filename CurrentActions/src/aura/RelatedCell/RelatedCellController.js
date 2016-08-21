({
	doInit: function(component, event, helper) {
		var item = component.get("v.item");
		console.log('item: '+item.value);

		console.log('baseURL: '+component.get("v.baseURL"));

        //debugger;

        // if (!helper.isSalesforceId(item.value)) {
        //      helper.assignIcon(component);
        //      return;
        // }

        var self = this;
        var type_action = component.get("c.typeNameForID");
        type_action.setParams({
        	"assoc_string": item.value
        });
        type_action.setCallback(self, function(actionResult) {


        	var result = actionResult.getReturnValue();
        	console.log('item: '+item+' type: '+result);
        	component.set("v.type", result);
        	helper.assignIcon(component);

        });
        $A.enqueueAction(type_action);


    },

    clickRelated : function(component, event, helper) {
    	createRecord : function (component, event, helper) {
    		var navEvt = $A.get("e.force:navigateToSObject");
    		navEvt.setParams({
    			var insight = component.get("v.insight");
    			"recordId": insight.Id;
    			"slideDevName": "related"
    		});
    		navEvt.fire();
    	}
    }
})
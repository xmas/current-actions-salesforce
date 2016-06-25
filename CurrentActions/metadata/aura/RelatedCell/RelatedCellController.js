({
	doInit: function(component, event, helper) {
        var item = component.get("v.item");
        console.log('item: '+item.value);
        //debugger;
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


	}
})
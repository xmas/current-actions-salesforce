({
    // Handle component initialization
    doInit : function(component, event, helper) {
        var type = component.get("v.type");
        var types = component.get("v.types");
        var typeOpts = new Array();

        // Set the feed types on the ui:inputSelect component
        for (var i = 0; i < types.length; i++) {
            typeOpts.push({label: types[i], value: types[i], selected: types[i] === type});
        }
        component.find("typeSelect").set("v.options", typeOpts);
    },

	onChangeType : function(component, event, helper) {
        var typeSelect = component.find("typeSelect");
        var type = typeSelect.get("v.value");
        component.set("v.type", type);

        // Dynamically create the feed with the specified type
        $A.createComponent("forceChatter:feed", {"type": type}, function(feed) {
            var feedContainer = component.find("feedContainer");
            feedContainer.set("v.body", feed);
        });
    }

})
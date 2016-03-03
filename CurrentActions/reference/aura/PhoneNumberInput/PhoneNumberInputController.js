({
	send : function(component, event, helper) {

        /* doesn't work since the sending source is the button, not the field */
        //var phoneNumber = event.source.get("v.phone");
        
        var phoneField = component.find("phone");
        var phoneNumber = phoneField.get("v.value");
        
        console.log("phone number on event set to: "+phoneNumber);
        $A.get("e.c:PhoneNumberEvent").setParams({
            phone: phoneNumber,
        }).fire();
	},
    toggle : function(component, event, helper) {
        var toggleText = component.find("toggleText");
        $A.util.toggleClass(toggleText, "toggle");
    }
})
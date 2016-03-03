({
	setPhoneNumber : function(component, event, helper) {
		var phoneNumber = event.getParam("phone");
        console.log("phone number set to: "+phoneNumber);
        component.set("v.number", phoneNumber);
	}
})
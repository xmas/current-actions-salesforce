({
	searchKeyChange: function(component, event, helper) {
		var myEvent = $A.get("e.c:SearchKeyChange");
        //console.log('fire key change: '+event.target.value);
		myEvent.setParams({"searchKey": event.target.value});

		myEvent.fire();
	}
})
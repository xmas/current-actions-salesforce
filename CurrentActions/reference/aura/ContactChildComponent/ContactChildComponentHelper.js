({
	updateSelectedAccount: function(component, selectedAccount) {

		var selectedAccount = component.get("v.selectedAccount");
		
		var action = component.get("c.getLstContact");
		action.setParams({
			"accountId" : selectedAccount
		});       
		action.setCallback(this,function(a){
			component.set("v.object",a.getReturnValue());
		});       
		$A.enqueueAction(action);

	}
})
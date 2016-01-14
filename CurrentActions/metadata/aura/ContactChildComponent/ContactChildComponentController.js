{   
	doInit : function(component, event, helper) {      
		var selectedAccount = component.get("v.selectedAccount");
		helper.updateSelectedAccount(component, selectedAccount);


		// var action = component.get("c.getLstContact");
		// action.setParams({
		// 	"accountId" : selectedAccount
		// });       
		// action.setCallback(this,function(a){
		// 	component.set("v.object",a.getReturnValue());
		// });       
		// $A.enqueueAction(action);
	},

	setSelectedAccount : function(component, event, helper) {
		var selectedAccount = event.getParam("account");
		console.log("account set to: "+selectedAccount);
		component.set("v.selectedAccount", selectedAccount);
		helper.updateSelectedAccount(component, selectedAccount);
	}   
})
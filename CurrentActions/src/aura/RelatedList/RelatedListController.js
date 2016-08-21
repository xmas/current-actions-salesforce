({
	doInit: function(component, event, helper) {

		var insight = component.get("v.insight");
		var related = JSON.parse(insight.Related__c);
 
			//debugger;

			try {
				var self = this;
				var url_action = component.get("c.baseURL");
				url_action.setCallback(self, function(actionResult) {

					var result = actionResult.getReturnValue();
					component.set("v.baseURL", result);
					component.set("v.related", related);
				});
				$A.enqueueAction(url_action);
			} catch (err) {
				console.log(err);
				console.log(err.stack);
			}
		//debugger;

	}


})
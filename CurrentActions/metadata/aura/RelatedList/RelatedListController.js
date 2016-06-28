({
	doInit: function(component, event, helper) {

		var insight = component.get("v.insight");
		var related = JSON.parse(insight.Related__c);

		component.set("v.related", related);

		//debugger;

	}



})

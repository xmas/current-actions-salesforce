({

	doInit : function(component, event, helper) {

		//Set up the callback
		var name_action = component.get("c.getUserName");
		name_action.setCallback(this, function(actionResult) {

			var result = actionResult.getReturnValue();
			component.set("v.name", result);

		});
		$A.enqueueAction(name_action);


		var total_action = component.get("c.totalInsightCount");
		total_action.setCallback(this, function(actionResult) {
			var result = actionResult.getReturnValue();
			component.set("v.totalCount", result);
		});
		$A.enqueueAction(total_action);

		helper.getSources(component);
	},

	postScript :  function(component, event, helper) {

		$('#source-option').change(function () {
			console.log('SOURCE SELECTION:'+$(this).val());

			var selectEvent = $A.get("e.c:AssocEvent");
			selectEvent.setParams({ "sourceIndex": $(this).val()});
			selectEvent.fire();
		});


		// $('#value-option').change(function () {
		//     console.log('VALUE SELECTION:'+$(this).val());
		// });

		//helper.getFieldsForSource(component, 0);


	},

	onSourceChange : function(component, event, helper) {
		//debugger;
		var source = component.find("sources").get("v.value");

		if (source === '') {
			component.set("v.fields", []);
			component.set("v.count", '00');
			component.set("v.sourceName", '');
			return;
		}
		component.set("v.sourceName", source+' ');


	   // var selectEvent = $A.get("e.c:AssocEvent");
	   //  selectEvent.setParams({ "sourceIndex": $(this).val()});
	   //  selectEvent.fire();

	   var self = this;
	   var action = component.get("c.getFieldsForSource");
	   action.setParams({
		    "data_source": source
		});
		action.setCallback(self, function(actionResult) {
			console.log('got fields: ');
			console.log(actionResult.getReturnValue());

			component.set("v.fields", actionResult.getReturnValue());
		});
		$A.enqueueAction(action);


		var source_action = component.get("c.getInsightsForSource");
		source_action.setParams({
		    "source": source
		});
		source_action.setCallback(self, function(actionResult) {
			var insights = actionResult.getReturnValue();
			console.log('for: '+source+' we found: '+insights.length);
			component.set("v.count", insights.length);
		});
		$A.enqueueAction(source_action);



	},

	onFieldChange : function(component, event, helper) {
		var source = component.find("sources").get("v.value");
		var field = component.find("fields").get("v.value");


		var selectEvent = $A.get("e.c:AssocEvent");
		selectEvent.setParams({ "source": source, "field" : field});
		selectEvent.fire();

		var fields = component.get("v.fields");
		for (var i = 0; i < fields.length; i++) {
			var item = fields[i];
			if (item.Field_Labels__c === field) {
				var count = item['expr0'];
				component.set("v.count", count);
				return;
			}
		}


	},

	countChange : function(component, event, helper) {
		var count = event.getParam("count");
		component.set("v.count", count);
	},

	assocSearch  : function(component, event, helper) {
		if (event.hasOwnProperty("sourceIndex")) {
			var index = event.getParam("sourceIndex");
		//debugger;
		helper.getFieldsForSource(component, index);
	}
	},

	menu : function(component, event, helper) {
		//console.log(event.target);
		$("#nav-dropdown").toggleClass("slds-is-open");
	}
})
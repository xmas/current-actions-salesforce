({
	doInit : function(component, event, helper) {

		//Fetch the insight list from the Apex controller
		helper.getInsightList(component, helper);
		//helper.registerServiceWorker();
		helper.sampleControllerAction(component);

		//Set up the callback
		var name_action = component.get("c.getUserName");
		name_action.setCallback(this, function(actionResult) {

			var result = actionResult.getReturnValue();
			component.set("v.name", result);

		});
		$A.enqueueAction(name_action);

		var total_action = component.get("c.maxCount");
		total_action.setCallback(this, function(actionResult) {
			var result = actionResult.getReturnValue();
			component.set("v.totalCount", result);
		});
		$A.enqueueAction(total_action);

	},

	postScript: function(component, event, helper) {

		$('<meta>', {name: 'viewport',content: 'user-scalable=no'}).appendTo('head');

	},

	assocSearch  : function(component, event, helper) {
		if (event.hasOwnProperty("sourceIndex")) {
			return;
		}
		var source = event.getParam("source");
		var field = event.getParam("field");

		var self = this;
		var action = component.get("c.getInsightsForSourceAndField");
		action.setParams({
			"source": source, "field": field
		});
		action.setCallback(self, function(actionResult) {
			var filtered = actionResult.getReturnValue();
			//debugger;
			console.log('just loaded in some filtered insights:'+filtered.length);
			component.set("v.filtered", filtered);
		});
		$A.enqueueAction(action);


	},

	filteredInsightsChanged : function(component, event, helper) {
		  var filterH = component.get("v.filterH");
		  filterH.slideTo(0);

		 _.defer(function () {
		 	filterH.update();
		 });
	},

	showPopup :  function(component, event, helper) {
		//called on clicking your button
		//run your form render code after that, run the following lines
		helper.showPopupHelper(component, helper, 'modaldialog', 'slds-fade-in-');
		helper.showPopupHelper(component, helper, 'backdrop','slds-backdrop--');
	},

	hidePopup :  function(component, event, helper) {
		helper.hidePopupHelper(component, helper, 'modaldialog', 'slds-fade-in-');
		helper.hidePopupHelper(component, helper, 'backdrop', 'slds-backdrop--');
	},

	showModalForInsight : function(component, event, helper) {
		var insight = event.getParam("insight");
		helper.showPopupHelper(component, helper, 'modaldialog', 'slds-fade-in-', insight);
		helper.showPopupHelper(component, helper, 'backdrop','slds-backdrop--');

	}

})
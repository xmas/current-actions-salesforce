({

	getInsightList: function(component) {

		try {
			var action = component.get("c.getInsights");

			var self = this;
			action.setCallback(self, function(actionResult) {

				var results =  actionResult.getReturnValue();
				console.log('insights returned: '+results.length);
				//  var result_err = new Error();
				// console.log(result_err.stack);

				try {
					console.log('DEFAULT GET INSIGHT LIST');
					component.set("v.insights", actionResult.getReturnValue());

					window.scrollTo(0, 0);
				} catch (err) {
					console.log(err);
					console.log(err.stack);
				}
			});
			$A.enqueueAction(action);
		} catch (err) {
			console.log(err);
			console.log(err.stack);
		}
	},

	getInsightAssocList: function(component, assoc_id) {

		var action = component.get("c.getInsightsWithAssociation");
		action.setParams({
			"assoc_id": assoc_id
		});

		//Set up the callback
		var self = this;
		action.setCallback(self, function(actionResult) {
			component.set("v.insights", actionResult.getReturnValue());
			window.scrollTo(0,0);

		});
		$A.enqueueAction(action);

		//
	},

	getInsightReportList: function(component, report_id) {

		//
		var action = component.get("c.getInsightsByReport");
		action.setParams({
			"report_id": report_id
		});

		//Set up the callback
		var self = this;
		action.setCallback(self, function(actionResult) {

			var result = actionResult.getReturnValue();
			console.log("setting new insights");
			component.set("v.insights", result);
			window.scrollTo(0,0);


		});
		$A.enqueueAction(action);

		//
	},

	getInsightTypeLabelList: function(component, label) {

		console.log("get insights for type label: "+label);

		//
		var action = component.get("c.getInsightsForTypeLabel");
		action.setParams({
			"labelID": label
		});

		//Set up the callback
		var self = this;
		action.setCallback(self, function(actionResult) {
			component.set("v.insights", actionResult.getReturnValue());
		   // window.scrollTo(0,0);

		});
		$A.enqueueAction(action);

		//
	},

	getInsightSourceList : function(component, source) {
		var action = component.get("c.getInsightsForSource");
		action.setParams({
			"source": source
		});

		//Set up the callback
		var self = this;
		action.setCallback(self, function(actionResult) {

			component.set("v.insights", actionResult.getReturnValue());
		   // window.scrollTo(0,0);

		});
		$A.enqueueAction(action);

	},

	markUnread : function(component, event, helper) {
		var action = component.get("c.setInsightReadStatus");
		var insight = component.get("v.insight");
		action.setParams({
			"insight_id": insight.Id,
			"status" : true
		});

		//Set up the callback
		var self = this;
		action.setCallback(this, function(actionResult) {
			component.set("v.unread", true);
		});
		$A.enqueueAction(action);
	},


	clickInsight : function (component, index) {

		var insights = component.get("v.insights");
		var insight = insights[index];

		console.log(index+" Accordion selected: "+insight.Name);

		var selectEvent = $A.get("e.c:InsightEvent");
		selectEvent.setParams({ "insight": insight });
		selectEvent.fire();

	}

})
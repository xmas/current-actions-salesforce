({
	postScript : function(component, event, helper) {
		var insight = component.get("v.insight");
		var mod = moment(insight.LastModifiedDate);
		var today = moment();
		//debugger;




		// 	component.set("v.time", "SAME");
		// } else {
		// 	component.set("v.time", "NOT SAME");
		// }

		//debugger;

		//console.log('daysAgo: '+mod.diff(today, 'day') +' hoursAgo: '+mod.diff(today, 'hour'));

		var daysAgo = mod.diff(today, 'day');
		if (Math.abs(daysAgo) === 1) {
			component.set("v.time", 'Yesterday');
			return;
		} else if (daysAgo < 1) {

			var hoursAgo = mod.diff(today, 'hour');
			if (hoursAgo > -1) {
				component.set("v.time", '<1hr');
				return ;
			} else if (hoursAgo > -6){
				component.set("v.time", Math.abs(hoursAgo)+'hrs');
				return;
			}

		}
		component.set("v.time", mod.format('ddd h:mm a'));

		var index = component.get("v.index");
		if (index === 0) {
			console.log('select first');
			var index_class = '#preview-cell-'+index;
			$(index_class).addClass('selected');
		}


	},
	doInit : function(component, event, helper) {

		var insight = component.get("v.insight");
		helper.assignIcon(component, insight);


		if (insight) {
			if (insight.Parent_Type__c === 'all' && insight.Child_Type__c === "group") {
				component.set("v.grouping", " grouped by ");
			}
			else if (insight.Parent_Type__c === 'group' && insight.Child_Type__c === "leaf") {
				component.set("v.grouping", " where ");
			}
		}


	},

	setSelectedInsight : function(component, event, helper) {
		var selected_insight = event.getParam("insight");
		var current_insight = component.get("v.insight");
		var index = component.get("v.index");


		var index_class = '#preview-cell-'+index;



		if (selected_insight === current_insight) {
			$(index_class).addClass('selected');
			console.log('INSIGHTS MATCH '+index_class);
			console.log(selected_insight.Path__c);
			console.log(current_insight.Path__c);

		} else {
			$(index_class).removeClass('selected');
		}

	},



	clickInsight : function(component, event, helper) {

		var insight = component.get("v.insight");


		var selectEvent = $A.get("e.c:InsightEvent");
		selectEvent.setParams({ "insight": insight });
		selectEvent.fire();

	},

})
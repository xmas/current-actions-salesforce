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

		console.log('daysAgo: '+mod.diff(today, 'day') +' hoursAgo: '+mod.diff(today, 'hour'));

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


	},
	doInit : function(component, event, helper) {


	},

})
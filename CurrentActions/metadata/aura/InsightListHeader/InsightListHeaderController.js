({
	
	doInit : function(component, event, helper) {

		//var AWS;

	},


	assocSearch  : function(component, event, helper) {

		var title = event.getParam("title");
		component.set("v.title", title);
	}
})
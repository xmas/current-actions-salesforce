//    Fire the select event to communicate the contact item
({
	select : function(component, event, helper) {
		var obj_id = component.get("v.objID");
		var rep_id = component.get("v.report");

		var selectEvent = $A.get("e.c:AssocEvent");
		selectEvent.setParams({ "assocID": obj_id });
		selectEvent.setParams({ "reportID": rep_id });
		selectEvent.fire();

	},
})
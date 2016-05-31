//    Fire the select event to communicate the contact item
({
	select : function(component, event, helper) {
		var obj_id = component.get("v.objID");
		var rep_id = component.get("v.report");
		var label_id = component.get("v.label");

		var selectEvent = $A.get("e.c:AssocEvent");
		selectEvent.setParams({ "assocID": obj_id });
		selectEvent.setParams({ "reportID": rep_id });
		selectEvent.setParams({ "label": label_id });
		selectEvent.setParams({ "title": component.get("v.title") });

		console.log(label_id+" firing label: "+selectEvent.getParam("label")+" report: "+selectEvent.getParam("reportID"));

		selectEvent.fire();

	},
})
({
	doInit : function(component, event, helper) {
		//Fetch the insight list from the Apex controller
		helper.getInsightList(component);

	},

	postScript: function(component, event, helper) {

	},

	insightsChanged : function (component, event, helper) {
		console.log('POST Insights CHANGED');
		var count_event = $A.get("e.c:InsightCountEvent");
		var insights = component.get("v.insights");
		var count = insights.length;
		count_event.setParams({"count": count});
		count_event.fire();

		if (insights.length > 0) {
			_.defer( function () {
				var selectEvent = $A.get("e.c:InsightEvent");
				selectEvent.setParams({ "insight": insights[0] });
				selectEvent.fire();
			});
		}

	},

	openModal : function(component, event, helper) {
		$A.createComponent(
			"c:InsightModal",
			{
				"aura:id": "modal",
				"insight": event.getParam("modal_open")

			},
			function(newModal){
				//Add the new button to the body array
				if (component.isValid()) {
					component.set("v.modal", [newModal]);
					//newModal.set("v.parent", [component]);
				}
			}
			);
	},

	closeModal : function(component, event, helper) {
		component.set("v.modal",[]);
	},


	subscribe : function (component, event, helper) {
		helper.registerServiceWorker();
	},

	myButtonHandler: function(component, event, helper) {
		//Get data via "data-data" attribute
		alert(event.target.getAttribute("data-data") + " was passed");
	},

	getInsight : function(component, event, helper) {
		var selected = event.getParam("insight");
		console.log(selected);
		var arr = component.get("v.selected");
		arr.push(selected);
		component.set("v.selected", arr);
	},

	openObject : function(component, event, helper) {
		var navEvt = $A.get("e.force:navigateToSObject");
		navEvt.setParams({
			"recordId": "a0E61000000q3Cv",
			"slideDevName": "chatter"
		});
		navEvt.fire();
	},

	assocSearch  : function(component, event, helper) {

		var assoc_id = event.getParam("assocID");
		var report_id = event.getParam("reportID");
		var label_id = event.getParam("label");

		var title = event.getParam("title");
		component.set("v.title", title);

		if (assoc_id == "ALL") {
			helper.getInsightList(component);

		} else if (assoc_id != null) {
			//helper.getInsightAssocList(component, assoc_id);
			helper.getInsightSourceList(component, assoc_id);
			//
		} else if (report_id != null) {
			console.log("get Insights by reports");
			helper.getInsightReportList(component, report_id);
		} else if (label_id != null) {
			console.log("get Insights by type labels");

			helper.getInsightTypeLabelList(component, label_id);
		}

	},


	toggleModal : function(component, event, helper) {
		$A.createComponent(
			"c:InsightModal",
			{
				"aura:id": "modal",
			},
			function(newModal){
				//Add the new button to the body array
				if (component.isValid()) {
					var body = component.get("v.body");
					body.push(newModal);
					component.set("v.body", body);
				}
			}
			);
	},

	handleAutocomplete : function(component, event, helper) {
		debugger;
		console.log("HANDLE handleAutocomplete");
		var so = event.getParam("selectedOption");
		document.getElementById("result").innerHTML = 'Selected:' + so.Name;
	},

	assertJQ : function(component, event, helper) {
		$(function() {
			$( "#draggable" ).draggable();
		});
	},

	searchKeyChange: function(component, event) {
		var searchKey = event.getParam("searchKey");
		var action = component.get("c.findByName");
		action.setParams({
			"searchKey": searchKey
		});
		action.setCallback(this, function(a) {
			component.set("v.contacts", a.getReturnValue());
		});
		$A.enqueueAction(action);
	}



})
({
	initHandlers: function(component) {
		var ready = component.get("v.ready");

		if (ready === false) {
			return;
		}
		
		var ctx = component.getElement();
		//debugger;
		$j(".autocomplete", ctx).autocomplete({
			minLength: 1,
			delay: 50,
			source: function(request, response) {
				var action = component.get("c.getSuggestions");
				var fieldsToGet = component.get("v.fields");
				
				
				action.setParams({
					"sObjectType": component.get("v.sObjectType"),
					"term": request.term,
					"fieldsToGet": fieldsToGet.join(),
					"limitSize": component.get("v.limit")
				});
				console.log(action);

				
				action.setCallback(this, function(a) {
					var suggestions = a.getReturnValue();
					//debugger;
					suggestions.forEach(function(s) {
						s["label"] = s.Name,
						s["value"] = s.Id
					});
					response(suggestions);
				});
				
				$A.run(function() {
					$A.enqueueAction(action); 
				});
			},
			select: function(event, ui) {  
				event.preventDefault();
				var ctx = component.getElement();
				$j(".autocomplete", ctx).val(ui.item.label);
				
				var selectionEvent = component.getEvent("autocompleteEvent");
				selectionEvent.setParams({
					selectedOption: ui.item 
				});
				selectionEvent.fire();
			}
		}

		);
}

})
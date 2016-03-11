({
	postScript: function(component, event, helper) {

		$(document).ready(function() {
			$(function() {
				$("#ticket-event-list").accordion({
					header: '.event'
				});
			});
		});
	}
})
({

    getSources : function(component, helper) {

        console.log('helper getReports');
        var action = component.get("c.getSources");
        //Set up the callback
        var self = this;
        action.setCallback(self, function(actionResult) {
            component.set("v.sources", actionResult.getReturnValue());

        });
        $A.enqueueAction(action);
    },

    refreshFilterBox : function (component) {
        console.log('in header controller');
        //debugger;
        $(".filter-select").select2().
        on('select2:select', function (evt) {
            console.log(evt.params.data.text);

            var selectEvent = $A.get("e.c:AssocEvent");
            selectEvent.setParams({ "assocID": evt.params.data.text });
            selectEvent.fire();
        });
    }

})
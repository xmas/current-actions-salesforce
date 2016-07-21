({

    getSources : function(component) {

        console.log('helper getReports');
        var action = component.get("c.getSources");
        //Set up the callback
        var self = this;
        action.setCallback(this, function(actionResult) {
            console.log('setting reports to base'+actionResult.getReturnValue());

            component.set("v.sources", actionResult.getReturnValue());
        });
        $A.enqueueAction(action);
    },


    getFieldsForSource : function (component, source_index) {
        try {
           // debugger;
        var sources = component.get("v.sources");
        var source = sources[source_index].Data_Source__c;

        console.log('helper get fields for source: '+source);

        var self = this;
         var action = component.get("c.getFieldsForSource");
          action.setParams({
            "data_source": source
        });
        action.setCallback(self, function(actionResult) {
            console.log('got fields: ');
            //debugger;
            console.log(actionResult.getReturnValue());

            component.set("v.fields", actionResult.getReturnValue());
        });
        $A.enqueueAction(action);
    } catch (err) {
        console.log('getFieldsForSource ERROR');
        console.log(err.stack);
    }
    }

})
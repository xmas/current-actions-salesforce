({
	getDataFromS3 : function(component, insight) {

          //
          var action = component.get("c.getFromS3");
        //debugger;
        action.setParams({
        	"path": insight["Path__c"]
        });
        console.log(insight["Path__c"]);

        //Set up the callback
        var self = this;
        action.setCallback(this, function(actionResult) {

        	var store = JSON.parse(actionResult.getReturnValue());
            //debugger;
            component.set("v.rows", store.data.rows);
        });
        $A.enqueueAction(action);

        //
        
    }

})
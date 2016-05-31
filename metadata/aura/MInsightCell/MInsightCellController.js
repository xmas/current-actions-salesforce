({
	 postScript : function(component, event, helper) {
        var fullinit = component.get("v.fullinit");
        if (fullinit) {
            helper.chartjs(component, event, helper);
        } else {
            component.set("v.fullinit", 'true');
        }


    },

    doInit : function(component, event, helper) {

        //var modal = component.find("modal");
        //console.log("toggle" + modal);
        //$A.util.toggleClass(modal, "toggle");
        var insight = component.get("v.insight");

        helper.assignIcon(component, insight);
        //helper.getDataFromS3(component, insight);

        var fullinit = component.get("v.fullinit");
        if (fullinit) {
            helper.chartjs(component, event, helper);
        } else {
            component.set("v.fullinit", 'true');
        }

    },

    navToList : function(component, event, helper) {
       // debugger;
        var ID = event.target.id;
        var type = event.target.assoctype;

        var navEvent = $A.get("e.c:NavEvent");
        //debugger;
        var params = {};
        if (type === "assoc") {
            params.assocID = ID;
        } else { 
            params.reportID = ID;
        }

        navEvent.setParams({direction: 'forward'});
        navEvent.setParams({params: JSON.stringify(params)});
        navEvent.setParams({type: "c:MInsightList"});

        navEvent.fire();     

    }
})
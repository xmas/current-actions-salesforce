({
    toggleModal : function(component) {
        var modal = component.find("modal");
        console.log("toggle" + modal);
        $A.util.toggleClass(modal, "toggle");
    },

    assignIcon : function(component, insight) {

        var type = insight["Report_Type_Label__c"];
        var icon = "";
        var icon_class = "";

        if (type === "Accounts") {
            icon =  "standard-sprite/svg/symbols.svg#account";
            icon_class = "slds-icon-standard-account";
        } else if (type === "Campaigns") {
            icon = "standard-sprite/svg/symbols.svg#campaign";
            icon_class = "slds-icon-standard-campaign";
        } else if (type === "Leads") {
            icon = "standard-sprite/svg/symbols.svg#lead";
            icon_class = "slds-icon-standard-lead";
        } else if (type === "Opportunities" || type === "Opportunity History") {
            icon = "standard-sprite/svg/symbols.svg#opportunity";
            icon_class = "slds-icon-standard-opportunity";
        } else if (type === "Users") {
            icon = "standard-sprite/svg/symbols.svg#people";
            icon_class = "slds-icon-standard-people";
        } else if (type === "Contacts & Accounts") {
            icon = "standard-sprite/svg/symbols.svg#team_member";
            icon_class = "slds-icon-standard-team-member";
        } else if (type === "Cases") {
            icon = "standard-sprite/svg/symbols.svg#case";
            icon_class = "slds-icon-standard-case";
        } else if (type.startsWith("Activities")) {
            icon = "action-sprite/svg/symbols.svg#check";
            icon_class = "slds-icon-action-new-task";
        }


        else {
            icon = "custom-sprite/svg/symbols.svg#custom4";
            icon_class = "slds-icon-custom-4";
        }

        component.set("v.icon", icon);
        component.set("v.icon_class", icon_class);
    },

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
    
    }, 

    chartjs : function (component, event, helper) {
           // Get context with jQuery - using jQuery's .get() method.
        // This will get the first returned node in the jQuery collection.

        var index = component.get("v.index");
        var chartid = '#chart-'+index;

        var ctx = $(chartid).get(0).getContext("2d");

        var insight = component.get("v.insight");
        //debugger;

        var chart = JSON.parse(insight.Chart__c);
        //debugger;
        chart = [chart[0], chart[1],chart[2],chart[3],chart[4]];
       //chart = chart.splice(0, 5);

        var data = {
            labels: ['one', 'two', '3', '4', '5'],
            datasets: [
            {
                label: "My First dataset",
                fillColor: "rgba(220,220,220,0.2)",
                strokeColor: "rgba(220,220,220,1)",
                pointColor: "rgba(220,220,220,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(220,220,220,1)",
                data: chart
            }

            ]
        };

        //debugger;
        var myLineChart = new Chart(ctx).Line(data);
    }

})
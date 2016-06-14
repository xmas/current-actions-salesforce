({
    toggleModal : function(component) {
        var modal = component.find("modal");
        console.log("toggle" + modal);
        $A.util.toggleClass(modal, "toggle");
    },

    assignIcon : function(component, insight) {

        // var type = insight["Report_Type_Label__c"];
        // var icon = "";
        // var icon_class = "";

        // if (type === "Accounts") {
        //     icon =  "standard-sprite/svg/symbols.svg#account";
        //     icon_class = "slds-icon-standard-account";
        // } else if (type === "Campaigns") {
        //     icon = "standard-sprite/svg/symbols.svg#campaign";
        //     icon_class = "slds-icon-standard-campaign";
        // } else if (type === "Leads") {
        //     icon = "standard-sprite/svg/symbols.svg#lead";
        //     icon_class = "slds-icon-standard-lead";
        // } else if (type === "Opportunities" || type === "Opportunity History") {
        //     icon = "standard-sprite/svg/symbols.svg#opportunity";
        //     icon_class = "slds-icon-standard-opportunity";
        // } else if (type === "Users") {
        //     icon = "standard-sprite/svg/symbols.svg#people";
        //     icon_class = "slds-icon-standard-people";
        // } else if (type === "Contacts & Accounts") {
        //     icon = "standard-sprite/svg/symbols.svg#team_member";
        //     icon_class = "slds-icon-standard-team-member";
        // } else if (type === "Cases") {
        //     icon = "standard-sprite/svg/symbols.svg#case";
        //     icon_class = "slds-icon-standard-case";
        // } else if (type.startsWith("Activities")) {
        //     icon = "action-sprite/svg/symbols.svg#check";
        //     icon_class = "slds-icon-action-new-task";
        // }


        // else {
            var icon = "custom-sprite/svg/symbols.svg#custom4";
            var icon_class = "slds-icon-custom-4";
        //}

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

    historyChart : function (component, event, helper) {
        // Get context with jQuery - using jQuery's .get() method.
        // This will get the first returned node in the jQuery collection.

        // var index = component.get("v.index");
        // var chartid = '#chart-'+index;
        // debugger;
        // var ctx = $(chartid).get(0).getContext("2d");

        // //console.log('insight: '+insight);

        console.log('CREATE HISTORY CHART');


        try {
            var insight = component.get("v.insight");

            var changed = JSON.parse(insight.History_Changed__c);
            var deleted = JSON.parse(insight.History_Deleted__c);
            var newones = JSON.parse(insight.History_New__c);
            var total = JSON.parse(insight.History_Total__c);
            var labels = JSON.parse(insight.History_Labels__c);

            var lastMonth = 0;
            for (var label_i = 0; label_i < labels.length; label_i++) {
                var date = moment(labels[label_i]);
                var month = date.month();
                if (lastMonth != month) {
                    lastMonth = month;
                    labels[label_i] = date.format('MMM D');
                } else {
                    labels[label_i] = date.format('MMM D');
                }
            }

            console.log(total);
            console.log(labels);

            var total_trace = {
                y: total,
                x: labels,
                //text: labels,
                type: "scatter"
            }
            var data = [total_trace];

            var chart_id = 'history-chart-'+component.get("v.index");

            console.log(document.readyState);

           console.log(data);
           //debugger;
            Plotly.newPlot(chart_id.toLowerCase(), data,  {margin: { t: 0 } }, {displayModeBar: false});


    }  catch (e) {
        console.log(e);
    }
}

})
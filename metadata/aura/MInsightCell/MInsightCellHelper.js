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
        //console.log(insight["Path__c"]);

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
        //console.log('insight: '+insight);


        try {
            var changed = JSON.parse(insight.History_Changed__c);
            var deleted = JSON.parse(insight.History_Deleted__c);
            var newones = JSON.parse(insight.History_New__c);
            var total = JSON.parse(insight.History_Total__c);

            // console.log('changed; '+changed);
            // console.log('deleted; '+deleted);
            // console.log('newones; '+newones);
            // console.log('total; '+total);


            // labels
            //debugger;
            var labels = JSON.parse(insight.History_Labels__c);
            var lastMonth = 0;
            for (var label_i = 0; label_i < labels.length; label_i++) {
                var date = moment(labels[label_i]);
                var month = date.month();
                if (lastMonth != month) {
                    lastMonth = month;
                    labels[label_i] = date.format('MMM D');
                } else {
                    labels[label_i] = date.format('D');
                }
            }
           // console.log('labels; '+labels);

            var t_color = 'rgba(39, 65, 238';
            var n_color = 'rgba(48, 131, 251';
            var c_color = 'rgba(83, 81, 135';
            var d_color = 'rgba(179, 37, 40';


            var data = {

                labels: labels,
                datasets: [
                {
                    label: "Total",
                    fillColor: t_color+",0.2)",
                    strokeColor: t_color+",1)",
                    pointColor: t_color+",1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: t_color+",1)",
                    data: total
                },
                {
                    label: "New",
                    fillColor: n_color+",0.2)",
                    strokeColor: n_color+",1)",
                    pointColor: n_color+",1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: n_color+",1)",
                    data: newones
                },
                {
                    label: "Changed",
                    fillColor: c_color+",0.2)",
                    strokeColor: c_color+",1)",
                    pointColor: c_color+",1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: c_color+",1)",
                    data: changed
                },
                {
                    label: "Deleted",
                    fillColor: d_color+",0.2)",
                    strokeColor: d_color+",1)",
                    pointColor: d_color+",1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: d_color+",1)",
                    data: deleted
                }

                ]
            };

            var scale_min = 5;
            if (_.max(total) < 5) {
                scale_min = 5
            } 

            if (_.max(total) < scale_min) {

                Chart.defaults.global.scaleOverride = true;
                Chart.defaults.global.scaleSteps = 5;
                Chart.defaults.global.scaleStepWidth = scale_min/5;
                Chart.defaults.global.scaleStartValue = 0;
                Chart.defaults.global.responsive = true;
                Chart.defaults.global.showTooltips = false;
            } else {
                Chart.defaults.global.scaleOverride = false;
            }

        //debugger;
        var myLineChart = new Chart(ctx).Line(data);

    }  catch (e) {
        console.log(insight.Chart__c);
    }
}

})
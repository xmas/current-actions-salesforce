({
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
            let icon = "custom-sprite/svg/symbols.svg#custom4";
            let icon_class = "slds-icon-custom-4";
        //}

        component.set("v.icon", icon);
        component.set("v.icon_class", icon_class);
    },

    normalized : function (number, min, max) {
      return (number * (max - min)) + min;
    }

})
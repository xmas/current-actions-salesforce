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

        console.log(insight["AssocTypeName__c"]+" icon: "+icon+" class: "+icon_class);
    },

    getDataFromS3 : function(component) {

          //
        var action = component.get("c.getFromS3");
        action.setParams({
            "path": "string"
        });

        //Set up the callback
        var self = this;
        action.setCallback(this, function(actionResult) {
            component.set("v.accounts", actionResult.getReturnValue());
        });
        $A.enqueueAction(action);

        //
    
    }

})
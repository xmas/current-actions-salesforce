({
    toggleModal : function(component) {
        var modal = component.find("modal");
        console.log("toggle" + modal);
        $A.util.toggleClass(modal, "toggle");
    },

    assignIcon : function(component, insight) {

        var type = insight["AssocTypeName__c"];
        var icon = "";
        var icon_class = "";

        if (type === "Account") {
            icon =  "standard-sprite/svg/symbols.svg#account";
            icon_class = "slds-icon-standard-account";
        } else if (type === "Campaign") {
            icon = "standard-sprite/svg/symbols.svg#campaign";
            icon_class = "slds-icon-standard-campaign";
        } else if (type === "Lead") {
            icon = "standard-sprite/svg/symbols.svg#lead";
            icon_class = "slds-icon-standard-lead";
        } else if (type === "Opportunity") {
            icon = "standard-sprite/svg/symbols.svg#opportunity";
            icon_class = "slds-icon-standard-opportunity";
        } else if (type === "User") {
            icon = "standard-sprite/svg/symbols.svg#people";
            icon_class = "slds-icon-standard-people";
        } else if (type === "UserRole") {
            icon = "standard-sprite/svg/symbols.svg#team_member";
            icon_class = "slds-icon-standard-team-member";
        } else {
            icon = "custom-sprite/svg/symbols.svg#custom4";
            icon_class = "slds-icon-custom-4";
        }

        component.set("v.icon", icon);
        component.set("v.icon_class", icon_class);

        console.log(insight["AssocTypeName__c"]+" icon: "+icon+" class: "+icon_class);
    }
})
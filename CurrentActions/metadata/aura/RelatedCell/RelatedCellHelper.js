({
	 assignIcon : function(component) {

        var icon = "";
        var icon_class = "";
        var type = component.get("v.type");
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
        } else {
            icon = "custom-sprite/svg/symbols.svg#custom97";
            icon_class = "slds-icon-standard-environment-hub";
        }

        component.set("v.icon", icon);
        component.set("v.icon_class", icon_class);

        console.log('assigned icon and class for: '+type);

        // $("#icon").addClass(icon);
        // $("#icon").addClass(icon_class);

        var item = component.get("v.item");
        var render_list = [item];
        component.set("v.render_list", render_list);


    }
})
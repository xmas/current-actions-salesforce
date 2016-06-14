({
    assignIcon : function(component, insight) {

        // var type = insight["Report_Type_Label__c"];
        var icon = "";
        var icon_class = "";

        var max = 7;
        var min = 0;
        var type = Math.floor(Math.random() * (max - min)) + min;

        switch (type) {
            case 0:
            icon =  "standard-sprite/svg/symbols.svg#account";
            icon_class = "slds-icon-standard-account";
            break;

            case 1:
            icon = "standard-sprite/svg/symbols.svg#lead";
            icon_class = "slds-icon-standard-lead";
            break;

            case 2:
            icon = "standard-sprite/svg/symbols.svg#campaign";
            icon_class = "slds-icon-standard-campaign";
            break;

            case 3:
            icon = "standard-sprite/svg/symbols.svg#opportunity";
            icon_class = "slds-icon-standard-opportunity";
            break;

            case 4:
            icon = "standard-sprite/svg/symbols.svg#people";
            icon_class = "slds-icon-standard-people";
            break;

            case 5:
            icon = "standard-sprite/svg/symbols.svg#team_member";
            icon_class = "slds-icon-standard-team-member";

            case 6:
            icon = "standard-sprite/svg/symbols.svg#case";
            icon_class = "slds-icon-standard-case";

            case 7:
            icon = "action-sprite/svg/symbols.svg#check";
            icon_class = "slds-icon-action-new-task";

            default:
            icon = "custom-sprite/svg/symbols.svg#custom97";
            icon_class = "slds-icon-custom-4";
        }

        component.set("v.icon", icon);
        component.set("v.icon_class", icon_class);
    },

    normalized : function (number, min, max) {
      return (number * (max - min)) + min;
  }

})
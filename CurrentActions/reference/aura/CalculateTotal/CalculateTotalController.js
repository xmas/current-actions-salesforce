/*errorHandlingCustomController.js*/
{
    calculate : function(component, event, helper) {
        var inputOne = component.find("inputOne").get("v.value");
        var inputTwo = component.find("inputTwo").get("v.value");
        var inputThree = component.find("inputThree").get("v.value");

        var total = parseInt(inputOne) + parseInt(inputTwo) + parseInt(inputThree);
        
        component.set("v.calculuatedValue", total);
        component.find("totalValue").set("v.value", total);
    },

    handleError: function(component, event){
        /* do any custom error handling
         * logic desired here */
    },

    handleClearError: function(component, event) {
        /* do any custom error handling
         * logic desired here */
    }
}
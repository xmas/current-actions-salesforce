//    Fire the select event to communicate the contact item
({
    select : function(component, event, helper) {
         var contact = component.get("v.insight");
        console.log("insight: " + insight);
        var selectEvent = $A.get("e.c:selectInsight");
        selectEvent.setParams({ "insight": insight }).fire();
    },
})
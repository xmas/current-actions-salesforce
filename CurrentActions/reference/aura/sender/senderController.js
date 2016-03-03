({
   /* send : function(component, event, helper) {
        var text = event.source.get("v.label");
        $A.get("e.c:message").setParams({
            text: text
       }).fire();
    }, */
    send : function(component, event, helper) {
        var messageEvent = component.getEvent("messageEvent");
        var text = event.source.get("v.label");
        messageEvent.setParams({
            "text": text
        });
        messageEvent.fire();
    }
})
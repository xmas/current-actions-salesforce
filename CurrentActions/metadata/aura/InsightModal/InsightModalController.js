({
    close : function(component, event, helper) {
        console.log("TRIGGER THE CLOSE EVENT FROM THE MODAL");
        //debugger;
        var modalCloseEvent = $A.get("e.c:modalClose");
        modalCloseEvent.setParams({modal_close: "close"});
        modalCloseEvent.fire();      
    }
})
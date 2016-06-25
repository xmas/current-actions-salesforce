({

    back :  function(component, event, helper) {
        var selectEvent = $A.get("e.c:SwiperNavEvent");
        selectEvent.setParams({ "filterHead": true});
        selectEvent.fire();
    },

})
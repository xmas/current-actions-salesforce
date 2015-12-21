({
    toggleModal : function(component) {
        var modal = component.find("modal");
        console.log("toggle" + modal);
        $A.util.toggleClass(modal, "toggle");
    }
})
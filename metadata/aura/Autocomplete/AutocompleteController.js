({
    
    assertJQ : function(component, event, helper) {       
    	console.log("LOADED JQUERY WE THINK");
    	//debugger;
        if (typeof jQuery !== "undefined" && typeof $j === "undefined") {
            $j = jQuery.noConflict(true);;
        }        
        
       	component.set("v.ready", true);
       	helper.initHandlers(component);
    }
})
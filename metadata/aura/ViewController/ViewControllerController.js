({
	
    postScript : function(component, event, helper) {


    },

    doInit : function(component, event, helper) {
        helper.sampleControllerAction(component);

        // var params = {level: 0, head_color: "pink",
        // color_array: ["green", "red", "blue", "orange"]};
        // var view = { type: "c:TestView", params: JSON.stringify(params)};

         var params = {assoc_id: "ALL"};
         var view = { type: "c:MInsightList", params: JSON.stringify(params)};

        helper.push_nav(component, event, helper, view);   

    },

    navEvent : function(component, event, helper) {

        var direction = event.getParam("direction");
        if (direction === "back") {
            helper.pop_nav(component, event, helper);
        } else {
         var new_params = event.getParam('params');
         var type = event.getParam('type');

         var view = {type: type, params: new_params};
         helper.push_nav(component, event, helper, view);            
     }


 }


})
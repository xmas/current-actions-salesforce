({
	

    postScript : function(component, event, helper) {


    },

    doInit : function(component, event, helper) {


       console.log('init_params: '+component.get("v.init_params"));

       var init_params = JSON.parse(component.get("v.init_params"));
       component.set("v.colors", init_params.color_array);
       component.set("v.head_color", init_params.head_color);
       component.set("v.level", init_params.level);

        //     var colors = ["green", "red", "blue", "orange"];
        //     component.set("v.colors", colors);
        //}
    },

    nav : function(component, event, helper) {
        //debugger;

        var level = component.get("v.level");
        level = level + 1;
        var params = {level: level, head_color: event.target.id,
            color_array: ["yellow", "red"]};
        var direction = event.target.direction;


        var navEvent = $A.get("e.c:NavEvent");
        navEvent.setParams({direction: direction});
        navEvent.setParams({params: JSON.stringify(params)});
        navEvent.setParams({type: "c:TestView"});

        navEvent.fire();      
    }
})
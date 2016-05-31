({
	push_nav: function(component, event, helper, view) {

        var nav_stack = component.get("v.nav_stack")
        if (!nav_stack) {
            nav_stack = [];
        }

        console.log('pushing. Current nav_stack: '+JSON.stringify(nav_stack, null, 4));
        console.log('view', JSON.stringify(view, null, 4));


        nav_stack.push(view);


        $A.createComponent(
            view.type,
            {
                "aura:id": "level1",
                "init_params": view.params
            },
            function(view){
                //Add the new button to the body array
                if (component.isValid()) {
                    var body = component.get("v.body");
                    body.push(view);
                    component.set("v.body", view);
                }
            });


        console.log('PUSHED. Current nav_stack: '+JSON.stringify(nav_stack, null, 4));
        component.set("v.nav_stack", nav_stack);

    },

    pop_nav: function(component, event, helper) {


        var nav_stack = component.get("v.nav_stack")
        console.log('popping. Current nav_stack: '+JSON.stringify(nav_stack, null, 4));
        nav_stack.pop();
        var view = nav_stack[nav_stack.length-1];
        $A.createComponent(
            view.type,
            {
                "aura:id": "level1",
                "init_params": view.params
            },
            function(view){
                //Add the new button to the body array
                if (component.isValid()) {
                    var body = component.get("v.body");
                    body.push(view);
                    component.set("v.body", view);
                }
            });


        console.log('POPPED. Current nav_stack: '+JSON.stringify(nav_stack, null, 4));
        component.set("v.nav_stack", nav_stack);

    },

    sampleControllerAction: function(cmp) {
        // subscribe to severity levels
        $A.logger.subscribe("INFO", logCustom);
        // Following subscriptions not exercised here but shown for completeness
        $A.logger.subscribe("WARNING", logCustom);
        $A.logger.subscribe("ASSERT", logCustom);
        $A.logger.subscribe("ERROR", logCustom);


        function logCustom(level, message, error) {
            console.log(getTimestamp(), "logCustom: ", arguments); 
        }

        function getTimestamp() {
            return new Date().toJSON();
        }
    }


})
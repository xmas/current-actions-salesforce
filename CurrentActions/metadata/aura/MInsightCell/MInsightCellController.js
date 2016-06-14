({


    doInit : function(component, event, helper) {

        var insight = component.get("v.insight");
        helper.assignIcon(component, insight);

        helper.setRelativeTime(component, event, helper);

        var index = component.get("v.index");
        if (index === 0) {
            console.log('select first');
            var index_class = '#preview-cell-'+index;
            $(index_class).addClass('selected');
        }

    },

    showDetails :  function(component, event, helper) {

        //debugger;
        var detailsEvent = $A.get("e.c:MInsightDetails");
        detailsEvent.setParams({
            "insight": component.get("v.insight"),
        });
        detailsEvent.fire();

    },

    preload : function(component, event, helper) {
        var params = event.getParam('arguments');
        console.log('called preload: '+component.get("v.index")+' on '+params.index);
        console.log('preload: '+component.get("v.index"));

        var this_slide = component.get("v.index");

        if (component.get("v.preloaded") === false ) {
            component.set("v.preloaded", true);
            helper.chartjs(component, event, helper);
        }
    },

    unload : function(component, event, helper) {


        if (component.get("v.preloaded") === true ) {
            var index = component.get("v.index");
            var chartid = 'chart-'+index;
            var chartid_lookup = '#'+chartid;

            var params = event.getParam('arguments');
            console.log('called UNLOAD: '+component.get("v.index")+' on '+params.index);
            var this_slide = component.get("v.index");

            component.set("v.preloaded", false);
            var chart_div = $(chartid_lookup);
            if (chart_div) {
                chart_div.remove();
            }

        }

    }

})
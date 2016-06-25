({


    doInit : function(component, event, helper) {

        var insight = component.get("v.insight");
        helper.assignIcon(component, insight);

        helper.setRelativeTime(component, event, helper);

        // var index = component.get("v.index");
        // if (index === 0) {
        //     console.log('select first');
        //     var index_class = '#preview-cell-'+index;
        //     $(index_class).addClass('selected');
        // }

    },

    postScript : function(component, event, helper) {
        var insight = component.get("v.insight");
        var mod = moment(insight.LastModifiedDate);
        var today = moment();

        var daysAgo = mod.diff(today, 'day');
        if (Math.abs(daysAgo) === 1) {
            component.set("v.time", 'Yesterday');
            return;
        } else if (daysAgo < 1) {

            var hoursAgo = mod.diff(today, 'hour');
            if (hoursAgo > -1) {
                component.set("v.time", '<1hr');
                return ;
            } else if (hoursAgo > -6){
                component.set("v.time", Math.abs(hoursAgo)+'hrs');
                return;
            }

        }
        component.set("v.time", mod.format('ddd h:mm a'));

        helper.loadChart(component, event, helper);

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
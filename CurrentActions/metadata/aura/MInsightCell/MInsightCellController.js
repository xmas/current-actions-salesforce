({


    doInit : function(component, event, helper) {

        var insight = component.get("v.insight");
        helper.assignIcon(component, insight);


        //LONG:
        //The Expected Revenue where Stage is "Id Decision Makers" and Assigned to "Europe"
            //has changed for A, B, C

        var value_label = insight.Value_Label__c;
        var field_labels = insight.Field_Labels__c;
        var child_label = insight.Child_Label__c;
        var source = insight.Data_Source__c;
        var count = insight.Today_Changed__c;
        if (count > 1) {
            count = count + '</strong> signficant items.';
        } else if ( count === 0) {
            count = 'no</strong> signficant items.';
        } else {
            count = '1</strong> signficant item.';
        }

        var title = 'The <strong>'+field_labels+'</strong> for <strong>'+child_label+' '+source+'</strong> has <strong>'+count;
        component.set("v.title", title);


    },

    postScript : function(component, event, helper) {

        helper.setRelativeTime(component, event, helper);
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

        // if (component.get("v.preloaded") === false ) {
        //     component.set("v.preloaded", true);
        //     helper.chartjs(component, event, helper);
        // }
    },

    unload : function(component, event, helper) {


        // if (component.get("v.preloaded") === true ) {
        //     var index = component.get("v.index");
        //     var chartid = 'chart-'+index;
        //     var chartid_lookup = '#'+chartid;

        //     var params = event.getParam('arguments');
        //     console.log('called UNLOAD: '+component.get("v.index")+' on '+params.index);
        //     var this_slide = component.get("v.index");

        //     component.set("v.preloaded", false);
        //     var chart_div = $(chartid_lookup);
        //     if (chart_div) {
        //         chart_div.remove();
        //     }

        // }

    }

})
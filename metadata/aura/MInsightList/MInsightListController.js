({
  doInit : function(component, event, helper) {
    helper.sampleControllerAction(component);


    var init_params = JSON.parse(component.get("v.init_params"));
    var assoc_id = init_params.assocID;
    var report_id = init_params.reportID;
    var label_id = init_params.label;

    console.log("init params: "+init_params);

    if (assoc_id == "ALL") {
        console.log("Default get insights");

        helper.getInsightList(component);
    } else if (assoc_id != null) {

      helper.getInsightAssocList(component, assoc_id);
        //
    } else if (report_id != null) {
        console.log("get Insights by reports");
        helper.getInsightReportList(component, report_id);
    } else if (label_id != null) {
        console.log("get Insights by type labels");

        helper.getInsightTypeLabelList(component, label_id);
    } else {
        console.log("Default get insights");

        helper.getInsightList(component);

    }



    var data_action = component.get("c.getInsightCounts");
    data_action.setCallback(this, function(actionResult) {

        var result = JSON.parse(actionResult.getReturnValue()); 

        component.set("v.global_total", result.all_users.total);
        component.set("v.global_new_changed", result.all_users.changed+result.all_users.new);
        component.set("v.user_total", result.user.total);
        component.set("v.user_new_changed", result.user.changed+result.user.new);

    });
    $A.enqueueAction(data_action);


    window.scrollTo(0,0);

},

postScript: function(component, event, helper) {

        // init the accordion
        console.log('are we crashing on init?');

        $(document).ready(function() {
            $(function() {
                $("#ticket-event-list").accordion({
                    header: '.event',
                    animate : false,
                    collapsible: true,
                    active: false,
                    heightStyle: "content",
                    beforeActivate: function( event, ui ) {

                        // defer loading
                        // console.log(event);
                        // console.log(ui);
                        //debugger;
                        ui.oldHeader.toggleClass('active');
                        ui.newHeader.toggleClass('active');
                        //helper.markUnread(component, event, helper);
                    }
                });
            });
        });

    },

    handleValueChange : function (component, event, helper) {

       if($) {
        $("#ticket-event-list").accordion({
            active: false,
            collapsible: true    
        });
        console.log('are we crashing on value change?');
        setTimeout(function () {
            $("#ticket-event-list").accordion("refresh");
        }, 0);
    }
},

openModal : function(component, event, helper) {
    $A.createComponent(
        "c:InsightModal",
        {
            "aura:id": "modal",
            "insight": event.getParam("modal_open")

        },
        function(newModal){
                //Add the new button to the body array
                if (component.isValid()) {
                    component.set("v.modal", [newModal]);
                    //newModal.set("v.parent", [component]);
                }
            }
            );
},

closeModal : function(component, event, helper) {
    component.set("v.modal",[]);
},

assocSearch  : function(component, event, helper) {

    var assoc_id = event.getParam("assocID");
    var report_id = event.getParam("reportID");
    var label_id = event.getParam("label");

    var title = event.getParam("title");
    component.set("v.title", title);

    if (assoc_id == "ALL") {
        helper.getInsightList(component);

    } else if (assoc_id != null) {
      helper.getInsightAssocList(component, assoc_id);

            //
        } else if (report_id != null) {
            console.log("get Insights by reports");
            helper.getInsightReportList(component, report_id);
        } else if (label_id != null) {
            console.log("get Insights by type labels");

            helper.getInsightTypeLabelList(component, label_id);
        }
    },
})
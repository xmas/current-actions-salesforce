({
    doInit : function(component, event, helper) {


        //Fetch the insight list from the Apex controller
        helper.getInsightList(component);
        //helper.registerServiceWorker();
        helper.sampleControllerAction(component);
    },

    postScript: function(component, event, helper) {

        // init the accordion
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
                    }
                });
            });
        });

    },

    handleValueChange : function (component, event, helper) {
       
        setTimeout(function () {
            $("#ticket-event-list").accordion("refresh");
        }, 0);

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


    subscribe : function (component, event, helper) {
        helper.registerServiceWorker();
    },

    myButtonHandler: function(component, event, helper) {
        //Get data via "data-data" attribute
        alert(event.target.getAttribute("data-data") + " was passed");
    },

    getInsight : function(component, event, helper) {
        var selected = event.getParam("insight");
        console.log(selected);
        var arr = component.get("v.selected");
        arr.push(selected);
        component.set("v.selected", arr);
    },

    openObject : function(component, event, helper) {
        var navEvt = $A.get("e.force:navigateToSObject");
        navEvt.setParams({
            "recordId": "a0E61000000q3Cv",
            "slideDevName": "chatter"
        });
        navEvt.fire();
    },

    assocSearch  : function(component, event, helper) {

        var assoc_id = event.getParam("assocID");
        var report_id = event.getParam("reportID");
        var label_id = event.getParam("label");


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

    toggleModal : function(component, event, helper) {
        $A.createComponent(
            "c:InsightModal",
            {
                "aura:id": "modal",
            },
            function(newModal){
                //Add the new button to the body array
                if (component.isValid()) {
                    var body = component.get("v.body");
                    body.push(newModal);
                    component.set("v.body", body);
                }
            }
            );
    },

    handleAutocomplete : function(component, event, helper) {
        debugger;
        console.log("HANDLE handleAutocomplete");
        var so = event.getParam("selectedOption");
        document.getElementById("result").innerHTML = 'Selected:' + so.Name;
    },

    assertJQ : function(component, event, helper) {
        $(function() {
            $( "#draggable" ).draggable();
        });
    },

    searchKeyChange: function(component, event) {
        var searchKey = event.getParam("searchKey");
        var action = component.get("c.findByName");
        action.setParams({
          "searchKey": searchKey
      });
        action.setCallback(this, function(a) {
            component.set("v.contacts", a.getReturnValue());
        });
        $A.enqueueAction(action);
    }



})
({
    //Fetch the insights from the Apex controller
    getInsightList: function(component, helper) {
        var action = component.get("c.getInsights");

        //Set up the callback
        var self = this;
        action.setCallback(this, function(actionResult) {
            var results =actionResult.getReturnValue();

            component.set("v.insights", results);

            _.defer(function () {
                var swiperH = new Swiper('.swiper-container-h', {
                    pagination: '.swiper-pagination-h',
                    spaceBetween: 50,
                    pagination: '.swiper-pagination',
                    paginationType: 'progress',
                    onSlideChangeStart : helper.swiperSlideChangeStartForward,
                    onTouchStart: helper.onTouchStart,
                    onTouchMove: helper.onTouchStart,
                    onSlideChangeEnd : helper.onSlideChangeEnd

                });
                component.set("v.swiperH", swiperH);
                var swiperV = new Swiper('.swiper-container-v', {
                    pagination: '.swiper-pagination-v',
                    direction: 'vertical',
                    spaceBetween: 50,
                    onSlideChangeEnd : helper.onSlideChangeEnd
                });
                component.set("v.swiperV", swiperH);

            });
        });
        $A.enqueueAction(action);
    },

    onSlideChangeEnd : function (swiper) {
         ga('send', 'event', 'Swiper', 'swipe', swiper.activeIndex);
         ga(function(tracker) {
          console.log(tracker.get('clientId'));
      });
     },

    swiperSlideChangeStartForward : function (swiper) {
        console.log('got start envent');
    },

    onTouchStart : function(swiper, event) {
        console.log(event);
        var current_index = swiper.activeIndex + 1;

    },

    showPopupHelper: function(component, componentId, className){
        var modal = component.find(componentId);
        var swiperH = component.get("v.swiperH");
        var swiperV = component.get("v.swiperV");
        swiperH.detachEvents();
        swiperV.detachEvents();

        var index = swiperH.activeIndex;
        console.log('swuper index: '+index);
        var insights = component.get("v.insights");
        var insight = insights[index];
        console.log(insight)

         $A.createComponent(
            "c:InsightCharts",
            {
                "insight": insight,
            },
            function(newChart){
                //Add the new button to the body array
                if (component.isValid()) {
                    var body = component.get("v.body");
                    body.push(newChart);
                    component.set("v.body", newChart);
                    //newModal.set("v.parent", [component]);
                }
            }
            );

        $A.util.removeClass(modal, className+'hide');
        $A.util.addClass(modal, className+'open');
        $A.util.toggleClass(modal, 'allow-scroll');
    },

    hidePopupHelper: function(component, componentId, className){
        var modal = component.find(componentId);

        var swiperH = component.get("v.swiperH");
        var swiperV = component.get("v.swiperV");
        swiperH.attachEvents();
        swiperV.attachEvents();

        $A.util.toggleClass(modal, 'allow-scroll');

        $A.util.addClass(modal, className+'hide');
        $A.util.removeClass(modal, className+'open');
        component.set("v.body", "");
    },

    getInsightAssocList: function(component, assoc_id) {

        var action = component.get("c.getInsightsWithAssociation");
        action.setParams({
            "assoc_id": assoc_id
        });

        //Set up the callback
        var self = this;
        action.setCallback(this, function(actionResult) {
            component.set("v.insights", actionResult.getReturnValue());
        });
        $A.enqueueAction(action);

        //
    },

    getInsightReportList: function(component, report_id) {

        //
        var action = component.get("c.getInsightsByReport");
        action.setParams({
            "report_id": report_id
        });

        //Set up the callback
        var self = this;
        action.setCallback(this, function(actionResult) {

            var result = actionResult.getReturnValue();
            console.log("setting new insights");
            component.set("v.insights", result);

        });
        $A.enqueueAction(action);

        //
    },

    getInsightTypeLabelList: function(component, label) {

        console.log("get insights for type label: "+label);

        //
        var action = component.get("c.getInsightsForTypeLabel");
        action.setParams({
            "labelID": label
        });



        //Set up the callback
        var self = this;
        action.setCallback(this, function(actionResult) {
            component.set("v.insights", actionResult.getReturnValue());
        });
        $A.enqueueAction(action);

        //
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
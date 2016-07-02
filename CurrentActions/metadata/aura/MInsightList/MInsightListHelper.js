({
	//Fetch the insights from the Apex controller
	getInsightList: function(component, helper) {

		var action = component.get("c.getInsights");

		//Set up the callback
		var self = this;
		action.setCallback(self, function(actionResult) {
			var results =actionResult.getReturnValue();

			component.set("v.insights", results);

			_.defer(function () {
				$A.getCallback(function() {

					var topH = new Swiper('.swiper-container-h-top',{

					});
					component.set("v.topH", topH);

					var swiperH = helper.createCardSwiper(
						"minsight-cell",
						".swiper-container-h",
						component,
						helper
						);
					component.set("v.swiperH",swiperH);

					component.set("v.swiperV",
						helper.createVerticalSwiper(
							"minsight-cell",
							".swiper-container-v",
							component,
							helper,
							swiperH
							));

					var filterH = helper.createCardSwiper(
						"filter-cell",
						".swiper-container-filter-h",
						component,
						helper
						);
					component.set("v.filterH",filterH);


					component.set("v.filterV",
						helper.createVerticalSwiper(
							"filter-cell",
							".swiper-container-filter-v",
							component,
							helper,
							filterH
							));
				});
			});
		});
		$A.enqueueAction(action);


	},

	onSlideChangeEnd : function (swiper) {
	},

	createVerticalSwiper : function  (aura_id, container_id, component, helper, h_swiper) {
		var vertical = new Swiper(container_id, {
			pagination: '.swiper-pagination-v',
			direction: 'vertical',
			spaceBetween: 50,
			onSlideChangeEnd : helper.onSlideChangeEnd,
			onTouchStart: function(swiper, event) {
				//var h_index = h_swiper.activeIndex;


			},
		});
		return vertical;
	},

	createCardSwiper : function (aura_id, container_id, component, helper) {
		var cardSwiper = new Swiper(container_id, {
			pagination: '.swiper-pagination-h',
			spaceBetween: 50,
			pagination: '.swiper-pagination',
			paginationType: 'progress',
			// onTouchStart: function(swiper, event) {
			// 	console.log(event);
			// 	var next_index = swiper.activeIndex + 1;
			// 	var slides = component.find(aura_id);
			// 	var next_slide = slides[next_index];
			// 	next_slide.preload(next_index);

			// },
			onSlideChangeEnd : function(swiper, event) {
				//debugger;
				// var slides = component.find(aura_id);

				// var activeIndex = swiper.activeIndex;
				// if ((activeIndex - 1) >= 0) {
				// 	var last_slide = slides[activeIndex - 1];
				// 	//last_slide.unload(activeIndex - 1);
				// }

				// var this_slide = slides[activeIndex];
				// this_slide.preload(activeIndex);

				var next_index = swiper.activeIndex + 1;
				var slides = component.find(aura_id);
				var next_slide = slides[next_index];
				next_slide.preload(next_index);

			},
			onSlidePrevEnd : function (swiper) {
				var slides = component.find(aura_id);
				var lastIndex = swiper.activeIndex + 1;
				if (!swiper.atEnd) {
					var last_slide = slides[lastIndex];
					//last_slide.unload(lastIndex);
				}
			}
		});

		return cardSwiper;
	},

	loadInsightData : function (component, insight) {

	// var index = swiperH.activeIndex;
	// console.log('swiper index: '+index);
	// var insights = component.get("v.insights");
	// var insight = insights[index];
	console.log(insight)

	// $A.createComponent(
	//     "c:InsightCharts",
	//     {
	//         "insight": insight,
	//     },
	//     function(newChart){
	//         //Add the new button to the body array
	//         if (component.isValid()) {
	//             var body = component.get("v.body");
	//             body.push(newChart);
	//             component.set("v.body", newChart);
	//             //newModal.set("v.parent", [component]);
	//         }
	//     }
	// );

	$A.createComponent(
		"c:RelatedList",
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

},

showPopupHelper: function(component, helper, componentId, className, insight){
	var modal = component.find(componentId);
	var swiperH = component.get("v.swiperH");
	var swiperV = component.get("v.swiperV");
	swiperH.detachEvents();
	swiperV.detachEvents();

	if (insight) {
		helper.loadInsightData(component, insight);
	}

	$A.util.removeClass(modal, className+'hide');
	$A.util.addClass(modal, className+'open');
	   // $A.util.toggleClass(modal, 'allow-scroll');

	   var targetEl = component.getElement();
	//    targetEl.addEventListener("touchmove", function(e) {
	//     e.stopPropagation();
	// }, false);
	targetEl.addEventListener("touchmove", helper.touchMoveFunction, false);
},

touchMoveFunction : function (e) {
	e.stopPropagation();
},

hidePopupHelper: function(component, helper, componentId, className){
	var modal = component.find(componentId);

	var swiperH = component.get("v.swiperH");
	var swiperV = component.get("v.swiperV");
	swiperH.attachEvents();
	swiperV.attachEvents();

	$A.util.addClass(modal, className+'hide');
	$A.util.removeClass(modal, className+'open');
	component.set("v.body", "");

	var targetEl = component.getElement();
	targetEl.removeEventListener("touchmove", helper.touchMoveFunction);
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
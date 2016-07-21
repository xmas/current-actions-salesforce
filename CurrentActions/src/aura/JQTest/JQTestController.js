({

	doInit : function(component, event, helper) {

		console.log(component);
		debugger;

	},

	postScript : function(component, event, helper) {


		try {
			var mySwiper = new Swiper ('.swiper-container', {
				direction: 'horizontal',
				pagination: '.swiper-pagination-h',
				spaceBetween: 50,
				onTouchStart: function(swiper, event) {
					console.log('swiper touch start');
					console.log(event);

				},
			});
			mySwiper.update();
		} catch (err) {
			console.log(err);
			console.log(err.stack);
		}

	}

})
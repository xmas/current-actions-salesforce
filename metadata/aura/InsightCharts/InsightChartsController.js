({
  
    postScript : function(component, event, helper) {

	  // var data = [
	  //   {"year": 1991, "name":"alpha", "value": 15},
	  //   {"year": 1992, "name":"alpha", "value": 34},
	  //   {"year": 1991, "name":"alpha2", "value": 17},
	  //   {"year": 1992, "name":"alpha2", "value": 65},
	  //   {"year": 1991, "name":"beta", "value": 10},
	  //   {"year": 1992, "name":"beta", "value": 10},
	  //   {"year": 1991, "name":"beta2", "value": 40},
	  //   {"year": 1992, "name":"beta2", "value": 38},
	  //   {"year": 1991, "name":"gamma", "value": 5},
	  //   {"year": 1992, "name":"gamma", "value": 10},
	  //   {"year": 1991, "name":"gamma2", "value": 20},
	  //   {"year": 1992, "name":"gamma2", "value": 34},
	  //   {"year": 1991, "name":"delta", "value": 50},
	  //   {"year": 1992, "name":"delta", "value": 43},
	  //   {"year": 1991, "name":"delta2", "value": 17},
	  //   {"year": 1992, "name":"delta2", "value": 35}
	  // ]
	  // var visualization = d3plus.viz()
	  // .width(400)
	  // .height(400)
	  //   .container("#viz")
	  //   .data(data)
	  //   .type("box")
	  //   .id("name")
	  //   .x("year")
	  //   .y("value")
	  //   .time("year")
	  //   .ui([{ 
	  //       "label": "Visualization Type",
	  //       "method": "type", 
	  //       "value": ["scatter","box"]
	  //     }])
	  //   .draw();

 nv.addGraph(function() {  
  var chart = nv.models.bulletChart();

  d3.select('#chart1 svg')
      .datum(helper.exampleData())
      .transition().duration(1000)
      .call(chart);

  return chart;
});


    },

   

     doInit : function(component, event, helper) {

        // var insight = component.get("v.insight");
        // helper.getDataFromS3(component, event, helper, insight);



    },

})
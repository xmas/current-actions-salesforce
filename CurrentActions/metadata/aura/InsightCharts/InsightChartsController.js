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

//  nv.addGraph(function() {
//   var chart = nv.models.bulletChart();

//   d3.select('#chart1 svg')
//       .datum(helper.exampleData())
//       .transition().duration(1000)
//       .call(chart);

//   return chart;
// });


    //  nv.addGraph(function() {
    //   var chart = nv.models.boxPlotChart()
    //       .x(function(d) { return d.label })
    //       .staggerLabels(true)
    //       .maxBoxWidth(75) // prevent boxes from being incredibly wide
    //       .yDomain([0, 500])
    //       ;
    //   d3.select('#chart1 svg')
    //       .datum(helper.exampleData())
    //       .call(chart);
    //   nv.utils.windowResize(chart.update);
    //   return chart;
    // });

    // let data = {"bar":[{"x":["Customer - Direct","Customer - Direct","Customer - Direct","Customer - Direct","Customer - Channel","","Customer - Channel","Customer - Direct","Customer - Channel","Customer - Direct","Customer - Direct","Customer - Channel"],"y":["","500000000","","","950000000","","30000000","350000000","50000000","139000000","5600000000","950000000"],"type":"bar"}],"box":[{"y":["","500000000","","","950000000","","30000000","350000000","50000000","139000000","5600000000","950000000"],"name":"Annual Revenue","type":"box"}],"choropleth":[{"type":"choropleth","locationmode":"USA-states","locations":["UK","IL","Singapore","AZ","","CA","CA","NC","KS","TX","NY","OR"],"z":["","500000000","","","950000000","","30000000","350000000","50000000","139000000","5600000000","950000000"],"text":["Customer - Direct","Customer - Direct","Customer - Direct","Customer - Direct","Customer - Channel","","Customer - Channel","Customer - Direct","Customer - Channel","Customer - Direct","Customer - Direct","Customer - Channel"],"zmin":null,"zmax":null,"colorscale":[[0,"rgb(242,240,247)"],[0.2,"rgb(218,218,235)"],[0.4,"rgb(188,189,220)"],[0.6,"rgb(158,154,200)"],[0.8,"rgb(117,107,177)"],[1,"rgb(84,39,143)"]],"colorbar":{"title":"Dollars USD","thickness":0.2},"marker":{"line":{"color":"rgb(255,255,255)","width":2}}}]};

    // let bar = data.bar;
    // Plotly.newPlot('bar', bar,  {margin: { t: 40 } }, { displaylogo: false});

    // let box = data.box;
    // Plotly.newPlot('box', box,  {margin: { t: 40 } }, { displaylogo: false});

    // let map = data.choropleth;
    // var layout = {
    //   title: 'Accounts Export',
    //   geo:{
    //       scope: 'usa',
    //       showlakes: true,
    //       lakecolor: 'rgb(255,255,255)'
    //   }
    // };

    // Plotly.newPlot('map', map, layout, {showLink: false}, { displaylogo: false});





    },



     doInit : function(component, event, helper) {

        var insight = component.get("v.insight");
        helper.getDataFromS3(component, event, helper, insight);



    },

})
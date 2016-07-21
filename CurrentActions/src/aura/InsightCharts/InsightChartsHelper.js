({
	getDataFromS3 : function(component, event, helper, insight) {

		//debugger;
		var action = component.get("c.getFromS3");
		action.setParams({
			"path": insight["Path__c"],
			"file": "stats.json"
		});
		console.log(insight["Path__c"]);

		//Set up the callback
		var self = this;
		action.setCallback(self, function(actionResult) {

			// console.log('returned in charts helper');
			// console.log(actionResult.getReturnValue());

			try {

				var store = JSON.parse(actionResult.getReturnValue());
				var charts = [];
				//debugger;
				if (_.has(store, 'stats')) {
					for (var chart in store.stats) {
						//debugger;

						if (chart === 'valueBoxPlot') {
							continue;
						}
						store.stats[chart].title = chart;
						charts.push(store.stats[chart]);
						console.log('chart title: '+chart);
					}
				} else {

					for (var member in store) {
						if (member === "insight") {
							continue;
						}

						var chart_obj = store[member];
						console.log(chart_obj);

						var stats = chart_obj.stats;
						console.log(stats);

						for (var chart in stats) {
							var chart_push = stats[chart];
							chart_push.title = member;
							console.log(chart_push);
							charts.push(chart_push);
						}
					}
				}

				component.set("v.charts", charts);
				var test = component.get("v.charts");
				console.log('WE JUST LOADEDED THESE'+test);
				//_.defer(helper.renderCharts(component));
				_.defer(function() {
					//$A.getCallback(function() {

				// 		var set_charts = component.get("v.charts");
				// 		console.log('Defer being called after setting the component chart value: '+set_charts.length);
				// 		if (set_charts.length > 0) {
				// 			console.log('call render charts from the deferred');
				//debugger;
				helper.renderCharts(component, helper);
				// 		} else {
				// 			console.log('delaying render charts from the deferred');
				// 		}
		//	})
				});
			} catch (error) {
				console.log('error on getting data from S3: '+error);
				console.log(store);
			}

		});

		$A.enqueueAction(action);
	},

	renderCharts : function(component, helper) {

		//debugger;
		try {
			var charts = component.get("v.charts");

			console.log('rendering the charts, we have: '+charts.length);

			for (var index = 0; index < charts.length; index++) {
				var chart_id = 'insight-charts-chart-'+index;
				var chart = charts[index];

				console.log(chart_id+':' + chart);
				console.log(document.readyState);

				var chart_data = chart.data;
				var chart_layout = chart.layout;

				//debugger;

				helper.renderWithChartjs(component, chart_id, chart);

				// Plotly.newPlot(chart_id.toLowerCase(), chart,  {margin: { t: 40 } }, { displaylogo: false});
			}
		} catch (err) {
			console.log('error on InsightsChartsHelper:renderCharts')
			console.log(err);
			console.log(err.stack);
		}

	},

	renderWithChartjs : function (component, chart_id, chart) {
		//debugger;
		try {
			var ctx = $('#'+chart_id);

			//debugger;
			var colors = chart.data[0].marker.color;
			var x = chart.data[0].x;
			var y = chart.data[0].y;

			var sig = '#ED1652';
			var normal = '#515458';

			// var sig_data = [];
			// var normal_data = [];

			// for (var i = 0; i < y.length; i++) {
			// 	if (colors[i] === sig) {
			// 		sig_data.push(y[i]);
			// 		normal_data.push(0);
			// 	} else {
			// 		sig_data.push(0);
			// 		normal_data.push(y[i]);
			// 	}
			// }

			//         data: [12, 19, 3, 5, 2, 3],
   //          backgroundColor: [
   //              'rgba(255, 99, 132, 0.2)',
   //              'rgba(54, 162, 235, 0.2)',
   //              'rgba(255, 206, 86, 0.2)',
   //              'rgba(75, 192, 192, 0.2)',
   //              'rgba(153, 102, 255, 0.2)',
   //              'rgba(255, 159, 64, 0.2)'
   //          ],
   //          borderColor: [
   //              'rgba(255,99,132,1)',
   //              'rgba(54, 162, 235, 1)',
   //              'rgba(255, 206, 86, 1)',
   //              'rgba(75, 192, 192, 1)',
   //              'rgba(153, 102, 255, 1)',
   //              'rgba(255, 159, 64, 1)'
   //          ],
   //          borderWidth: 1

			// var sig_set = {
			// 	"label": "Sig",
			// 	"backgroundColor": sig,
			// 	"borderColor": sig,
			// 	"borderWidth": 1,
			// 	"hoverBackgroundColor":sig,
			// 	"hoverBorderColor": sig,
			// 	"data": sig_data
			// };

			var normal_set = {
				"label": "Significance",
				"backgroundColor": colors,
				"borderColor": colors,
				"borderWidth": 1,
				"hoverBackgroundColor":colors,
				"hoverBorderColor": colors,
				"data": y
			};

			var data = {
				"labels": x,
				"datasets": [ normal_set]
			};

			console.log('render this chart:');
			console.log(JSON.stringify(data));

			var myChart = new Chart(ctx, {
				type: 'bar',
				data: data,
				options: {
					scales: {
						xAxes: [{
							display: false
						}]
					}
				}
			});




		} catch (err) {
			console.log('render with ChartJS error');
			console.log(err);
			console.log(err.stack);
		}


	}

// 	// renderWithPlotly : function (component, chart_id, chart_data, chart_layout) {
// 	// 	//Plotly.newPlot(chart_id.toLowerCase(), chart_data, chart_layout, { displaylogo: false});
// 	// },


// 	// getValuesAtCol : function (rows, col) {
// 	// 	var values = [];
// 	// 	for (var i = 0; i < rows.length; i++) {
// 	// 		var dataCells = rows[i].dataCells;
// 	// 		var cell = dataCells[col];
// 	// 		var value = cell.value;
// 	// 		if (_.isNumber(value)) {
// 	// 			values.push(cell.value);
// 	// 		} else {
// 	// 			values.push(cell.value.amount);
// 	// 		}

// 	// 	}
// 	// 	return values;
// 	// },

// 	// getLabels : function (rows) {
// 	// 	var labels = [];
// 	// 		 // debugger;
// 	// 		 for (var i = 0; i < rows.length; i++) {
// 	// 		 	var dataCells = rows[i].dataCells;
// 	// 		 	console.log('dataCells: '+dataCells);
// 	// 		 	var nameCell = dataCells[0];
// 	// 		 	labels.push(nameCell.label);
// 	// 		 }
// 	// 		 return labels;
// 	// 		},

// 	// 		exampleDataBar : function() {
// 	// 			return {
// 	// 			"title":"Revenue",      //Label the bullet chart
// 	// 			"subtitle":"US$, in thousands",     //sub-label for bullet chart
// 	// 			"ranges":[150,225,300],  //Minimum, mean and maximum values.
// 	// 			"measures":[220],        //Value representing current measurement (the thick blue line in the example)
// 	// 			"markers":[250]          //Place a marker on the chart (the white triangle marker)
// 	// 		};
// 	// 	},

// 	// 	exampleData : function() {     return  [
// 	// 		{
// 	// 			label: "Sample A",
// 	// 			values: {
// 	// 				Q1: 120,
// 	// 				Q2: 150,
// 	// 				Q3: 200,
// 	// 				whisker_low: 115,
// 	// 				whisker_high: 210,
// 	// 				outliers: [50, 100, 225]
// 	// 			},
// 	// 		},
// 	// 		{
// 	// 			label: "Sample B",
// 	// 			values: {
// 	// 				Q1: 300,
// 	// 				Q2: 350,
// 	// 				Q3: 400,
// 	// 				whisker_low: 225,
// 	// 				whisker_high: 425,
// 	// 				outliers: [175]
// 	// 			},
// 	// 		},
// 	// 		{
// 	// 			label: "Sample C",
// 	// 			values: {
// 	// 				Q1: 50,
// 	// 				Q2: 100,
// 	// 				Q3: 125,
// 	// 				whisker_low: 25,
// 	// 				whisker_high: 175,
// 	// 				outliers: [0]
// 	// 			},
// 	// 		}
// 	// 		];
// 	// 	}

// 		// headersFromKey : function (array, key) {
// 		//     var new_array = [];
// 		//     //{ title: "Name" },
// 		//     for (var i = 0; i < array.length; i++) {
// 		//         new_array.push({ title: array[i][key]});
// 		//         new_array.push({ title: array[i][key]+'.value'});
// 		//         new_array.push({ title: array[i][key]+'.meta'});
// 		//     }
// 		//     return new_array;
// 		// },

// 		// data : function (rows) {
// 		//     var data_rows = [];
// 		//     for (var i = 0; i < rows.length; i++) {
// 		//         var dataCells = rows[i].dataCells;
// 		//         var data_row = [];
// 		//         for (var cell_index = 0; cell_index < dataCells.length; cell_index++) {
// 		//             data_row.push(dataCells[cell_index].label);
// 		//             data_row.push(dataCells[cell_index].value);
// 		//             if (dataCells[cell_index].delta) {
// 		//                 data_row.push(dataCells[cell_index].delta);
// 		//                 console.log(JSON.stringify(dataCells[cell_index].delta, null, 4));
// 		//             } else {
// 		//                 data_row.push('0');
// 		//             }
// 		//         }

// 		//         data_rows.push(data_row);
// 		//     }
// 		//     return data_rows;

// 		// }
// //[ "Tiger Nixon", "System Architect", "Edinburgh", "5421", "2011/04/25", "$320,800" ]


})
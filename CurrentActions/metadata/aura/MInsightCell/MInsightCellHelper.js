({
	assignIcon : function(component, insight) {

		// var type = insight["Report_Type_Label__c"];
		// var icon = "";
		// var icon_class = "";

		// if (type === "Accounts") {
		//     icon =  "standard-sprite/svg/symbols.svg#account";
		//     icon_class = "slds-icon-standard-account";
		// } else if (type === "Campaigns") {
		//     icon = "standard-sprite/svg/symbols.svg#campaign";
		//     icon_class = "slds-icon-standard-campaign";
		// } else if (type === "Leads") {
		//     icon = "standard-sprite/svg/symbols.svg#lead";
		//     icon_class = "slds-icon-standard-lead";
		// } else if (type === "Opportunities" || type === "Opportunity History") {
		//     icon = "standard-sprite/svg/symbols.svg#opportunity";
		//     icon_class = "slds-icon-standard-opportunity";
		// } else if (type === "Users") {
		//     icon = "standard-sprite/svg/symbols.svg#people";
		//     icon_class = "slds-icon-standard-people";
		// } else if (type === "Contacts & Accounts") {
		//     icon = "standard-sprite/svg/symbols.svg#team_member";
		//     icon_class = "slds-icon-standard-team-member";
		// } else if (type === "Cases") {
		//     icon = "standard-sprite/svg/symbols.svg#case";
		//     icon_class = "slds-icon-standard-case";
		// } else if (type.startsWith("Activities")) {
		//     icon = "action-sprite/svg/symbols.svg#check";
		//     icon_class = "slds-icon-action-new-task";
		// }


		// else {
			var icon = "custom-sprite/svg/symbols.svg#custom4";
			var icon_class = "slds-icon-standard-environment-hub";
		//}

		component.set("v.icon", icon);
		component.set("v.icon_class", icon_class);
	},

	normalized : function (number, min, max) {
		return (number * (max - min)) + min;
	},

	capitalizeFirstLetter : function (string) {
    	return string.charAt(0).toUpperCase() + string.slice(1);
	},

	setRelativeTime : function(component, event, helper) {
		try {
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
		} catch (err) {
			console.log('error setting relative time');
			console.log(err.stack);
		}

	},

	loadChart : function (component, event, helper) {
		var index = component.get("v.index");
		var chart_id = 'minsight-cell-chart-'+index;
		//debugger;
		var width = $('#'+chart_id).width();

		var selectorOptions = {
			buttons: [{
				step: 'month',
				stepmode: 'backward',
				count: 1,
				label: '1m'
			}, {
				step: 'month',
				stepmode: 'backward',
				count: 6,
				label: '6m'
			}, {
				step: 'year',
				stepmode: 'todate',
				count: 1,
				label: 'YTD'
			}, {
				step: 'year',
				stepmode: 'backward',
				count: 1,
				label: '1y'
			}, {
				step: 'all',
			}],
		};

		var insight = component.get("v.insight");
		var chart_data = [];
		try {
		//debugger;
			if (_.isUndefined(insight.Chart__c)) {
				return;
			}

			var base = JSON.parse(insight.Chart__c);
			chart_data = base.data;
			var dates = base.dates;

			// #

			// #DC0032

			var scale = chroma.scale(['#DEAABA','#E50041']).colors(chart_data.length);

			for (var i = 0; i < chart_data.length; i++) {
				chart_data[i].x = dates;
				chart_data[i].color = '#292831';
				chart_data[i].line = {
					// color: chroma('#E50041').brighten(i).hex(),
					color : scale[i],
					width: 2
				};
			}

		} catch (err) {
			console.log('Chart__c parsing error');
			console.log(err.stack);
			return;
		}
		var chart_layout = {
			"annotations" : [],
			"xaxis": {
				"rangeselector": {
					"buttons": [{
						"step": "month",
						"stepmode": "backward",
						"count": 1,
						"label": "1m"
					}, {
						"step": "month",
						"stepmode": "backward",
						"count": 6,
						"label": "6m"
					}, {
						"step": "year",
						"stepmode": "todate",
						"count": 1,
						"label": "YTD"
					}, {
						"step": "year",
						"stepmode": "backward",
						"count": 1,
						"label": "1y"
					}, {
						"step": "all"
					}]
				}
			},
			"yaxis": {
				"fixedrange": true,
				"color": '#808080'
			},
			"showlegend": false,
			"legend": {
				"orientation": "v",
				"y": -20
			},
			"xaxis": {
				"tickformat": "%b %d",
				"color": '#808080',
				"showgrid": false
			},
			"autosize": false,
			"height": 140,
			"width": width,
			"margin": {
				"l": 40,
				"r": 0,
				"b": 20,
				"t": 10,
				"pad": 5
			}
		}

		// for( var i = 0 ; i < chart_data.length ; i++ ) {
		// 	var trace = chart_data[i];

		// 	var result2 = {
		// 		xref: 'paper',
		// 		x: 1.02,
		// 		y: i*5000,//trace.y[trace.y.length],
		// 		xanchor: 'left',
		// 		yanchor: 'middle',
		// 		text: trace.name,
		// 		font: {
		// 			family: 'Arial',
		// 			size: 12,
		// 			color: '#363540'
		// 		},
		// 		showarrow: false
		// 	};

		// 	chart_layout.annotations.push(result2);
		// }

		console.log( 'var data ='+ JSON.stringify(chart_data) +' var layout ='+ JSON.stringify(chart_layout));

		var opts =  {displaylogo: false,
			staticPlot: true,
			displayModeBar: false}

		Plotly.newPlot(chart_id.toLowerCase(), chart_data, chart_layout, opts);
	},


})
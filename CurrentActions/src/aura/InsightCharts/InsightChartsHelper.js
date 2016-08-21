({
  getDataFromS3 : function(component, event, helper, insight) {

    var action = component.get("c.getFromS3");
    action.setParams({
      "path": insight["Path__c"],
      "file": "stats.json"
    });
    console.log(insight["Path__c"]);

    //Set up the callback
    var self = this;
    action.setCallback(this, function(actionResult) {

      // console.log('returned in charts helper');
      // console.log(actionResult.getReturnValue());

      try {

        var store = JSON.parse(actionResult.getReturnValue());
        var charts = [];
        //debugger;
        if (_.has(store, 'stats')) {
          for (var chart in store.stats) {
            //debugger;
            store.stats[chart].title = chart;
            charts.push(store.stats[chart]);
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
          var set_charts = component.get("v.charts");
          console.log('Defer being called after setting the component chart value: '+set_charts.length);
          if (set_charts.length > 0) {
            console.log('call render charts from the deferred');
            helper.renderCharts(component);
          } else {
            console.log('delaying render charts from the deferred');

            //_.delay(helper.renderCharts(component), 10000);
          }
        })

      } catch (error) {
        console.log('error on getting data from S3: '+error);
        console.log(store);
        //debugger;
      }
    });

    $A.enqueueAction(action);
  },

  renderCharts : function(component) {

    try {
      var charts = component.get("v.charts");

      console.log('rendering the charts, we have: '+charts.length);

      for (var index = 0; index < charts.length; index++) {
        var chart_id = 'insight-charts-chart-'+index;
        var chart = charts[index];

        console.log(chart_id+':' + chart);
        console.log(document.readyState);
        //debugger;

        var chart_data = chart.data;
        var chart_layout = chart.layout;

        Plotly.newPlot(chart_id.toLowerCase(), chart_data, chart_layout, { displaylogo: false});

        // Plotly.newPlot(chart_id.toLowerCase(), chart,  {margin: { t: 40 } }, { displaylogo: false});
      }
    } catch (error) {
      var charts = component.get("v.charts");
      console.log('ERROR: '+error);

      console.log('error with charts: '+charts);
      debugger;
    }

  }

})
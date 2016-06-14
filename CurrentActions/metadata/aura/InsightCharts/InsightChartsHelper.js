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
        if (_.has(store, 'stats')) {
          for (var chart in store.stats) {
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
        debugger;
      }
    });

    $A.enqueueAction(action);
  },

  renderCharts : function(component) {

    try {
      var charts = component.get("v.charts");

      console.log('rendering the charts, we have: '+charts.length);

      for (var index = 0; index < charts.length; index++) {
        var chart_id = 'foo-chart-'+index;
        var chart = charts[index];

        console.log(chart_id+':' + chart);
        console.log(document.readyState);

        Plotly.newPlot(chart_id.toLowerCase(), chart,  {margin: { t: 40 } }, { displaylogo: false});
      }
    } catch (error) {
      var charts = component.get("v.charts");
      console.log('ERROR: '+error);

      console.log('error with charts: '+charts);
      debugger;
    }

  },


  getValuesAtCol : function (rows, col) {
    var values = [];
    for (var i = 0; i < rows.length; i++) {
      var dataCells = rows[i].dataCells;
      var cell = dataCells[col];
      var value = cell.value;
      if (_.isNumber(value)) {
        values.push(cell.value);
      } else {
        values.push(cell.value.amount);
      }

    }
    return values;
  },

  getLabels : function (rows) {
    var labels = [];
       // debugger;
       for (var i = 0; i < rows.length; i++) {
        var dataCells = rows[i].dataCells;
        console.log('dataCells: '+dataCells);
        var nameCell = dataCells[0];
        labels.push(nameCell.label);
      }
      return labels;
    },

    exampleDataBar : function() {
      return {
        "title":"Revenue",      //Label the bullet chart
        "subtitle":"US$, in thousands",     //sub-label for bullet chart
        "ranges":[150,225,300],  //Minimum, mean and maximum values.
        "measures":[220],        //Value representing current measurement (the thick blue line in the example)
        "markers":[250]          //Place a marker on the chart (the white triangle marker)
      };
    },

    exampleData : function() {     return  [
      {
        label: "Sample A",
        values: {
          Q1: 120,
          Q2: 150,
          Q3: 200,
          whisker_low: 115,
          whisker_high: 210,
          outliers: [50, 100, 225]
        },
      },
      {
        label: "Sample B",
        values: {
          Q1: 300,
          Q2: 350,
          Q3: 400,
          whisker_low: 225,
          whisker_high: 425,
          outliers: [175]
        },
      },
      {
        label: "Sample C",
        values: {
          Q1: 50,
          Q2: 100,
          Q3: 125,
          whisker_low: 25,
          whisker_high: 175,
          outliers: [0]
        },
      }
      ];
    }

    // headersFromKey : function (array, key) {
    //     var new_array = [];
    //     //{ title: "Name" },
    //     for (var i = 0; i < array.length; i++) {
    //         new_array.push({ title: array[i][key]});
    //         new_array.push({ title: array[i][key]+'.value'});
    //         new_array.push({ title: array[i][key]+'.meta'});
    //     }
    //     return new_array;
    // },

    // data : function (rows) {
    //     var data_rows = [];
    //     for (var i = 0; i < rows.length; i++) {
    //         var dataCells = rows[i].dataCells;
    //         var data_row = [];
    //         for (var cell_index = 0; cell_index < dataCells.length; cell_index++) {
    //             data_row.push(dataCells[cell_index].label);
    //             data_row.push(dataCells[cell_index].value);
    //             if (dataCells[cell_index].delta) {
    //                 data_row.push(dataCells[cell_index].delta);
    //                 console.log(JSON.stringify(dataCells[cell_index].delta, null, 4));
    //             } else {
    //                 data_row.push('0');
    //             }
    //         }

    //         data_rows.push(data_row);
    //     }
    //     return data_rows;

    // }
//[ "Tiger Nixon", "System Architect", "Edinburgh", "5421", "2011/04/25", "$320,800" ]


})
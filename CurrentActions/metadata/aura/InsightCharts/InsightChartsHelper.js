({
    getDataFromS3 : function(component, event, helper, insight) {

          //
          var action = component.get("c.getFromS3");
        //debugger;
        action.setParams({
            "path": insight["Path__c"]
        });
        console.log(insight["Path__c"]);
          
        //Set up the callback
        var self = this;
        action.setCallback(this, function(actionResult) {


            var store = JSON.parse(actionResult.getReturnValue());
            var charts = [];
            var rows = store.data.rows;
            
            var headers = store.headers;
            var labels = this.getLabels(rows);

            var t_color = 'rgba(39, 65, 238';
            var n_color = 'rgba(48, 131, 251';
            var c_color = 'rgba(83, 81, 135';
            var d_color = 'rgba(179, 37, 40';

            for (var h_index = 0; h_index < headers.length; h_index++) {
                var header = headers[h_index];
                if (header.dataType === "int" || header.dataType === "currency") {
                    var chart_data = {
                        labels : labels,
                        datasets: [
                        {
                            label: header.label,
                            fillColor: t_color+",0.2)",
                            strokeColor: t_color+",1)",
                            pointColor: t_color+",1)",
                            pointStrokeColor: "#fff",
                            pointHighlightFill: "#fff",
                            pointHighlightStroke: t_color+",1)",
                            data: this.getValuesAtCol(rows, h_index)
                        }]
                    };
                    var chart = {
                        title : header.label,
                        data : chart_data
                    };
                    charts.push(chart);
                }
            }

            console.log('render charts: '+JSON.stringify(charts, null, 4));

            component.set("v.charts", charts);

           _.defer(function () {
                var setCharts = component.get("v.charts");  
                Chart.defaults.global.scaleOverride = false;
                for (var chart_index = 0; chart_index < setCharts.length; chart_index++) {

                    var chartid = '#detail-chart-'+chart_index;
                  var ctx = $(chartid).get(0).getContext("2d");
                  //var ctx = document.getElementById(chartid).getContext("2d");
                  var myLineChart = new Chart(ctx).Bar(setCharts[chart_index].data);

              }
          }, 0);

            //
      

    });
        $A.enqueueAction(action);

        //
        
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

      exampleData : function() {
  return {
    "title":"Revenue",      //Label the bullet chart
    "subtitle":"US$, in thousands",     //sub-label for bullet chart
    "ranges":[150,225,300],  //Minimum, mean and maximum values.
    "measures":[220],        //Value representing current measurement (the thick blue line in the example)
    "markers":[250]          //Place a marker on the chart (the white triangle marker)
  };
},

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
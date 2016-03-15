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
            //debugger;
            component.set("v.rows", store.data.rows);
            // component.set("v.headers", store.data.rows);
            //debugger;

            var headers = this.headersFromKey(store.headers, "label");
            console.log(headers);
            var data = this.data(store.data.rows);

            var col_vis_array = [];
            for (var i = 0; i < headers.length; i++) {
                if ((i % 3)){
                    col_vis_array.push(i);
                }
            }
            //console.log(col_vis_array);
            var myRe = /(\d\d\d\d\d)/;

            $('#example').DataTable( {
                data: data,
                columns: headers,
                "columnDefs": [
                {
                    "render": function ( data, type, row, meta ) {
                        // START RENDER FUNCTION

                        // console.log('data: '+data);
                        // console.log('type: '+type);
                        // console.log('row: '+row);
                        // console.log('meta: '+meta);

                        if(type === 'display') {
                            return '<a href="https://rowan-dev-ed.my.salesforce.com/'+row[meta.col+1]+'">'+data+'</a>';
                        } else {
                            return data;
                        }

                        // END RENDER FUNCTION
                    },
                    "targets": 0
                },
                { "visible": false,  "targets": col_vis_array}
                ]
            });

    });
        $A.enqueueAction(action);

        //
        
    },

    headersFromKey : function (array, key) {
        var new_array = [];
        //{ title: "Name" },
        for (var i = 0; i < array.length; i++) {
            new_array.push({ title: array[i][key]});
            new_array.push({ title: array[i][key]+'.value'});
            new_array.push({ title: array[i][key]+'.meta'});
        }
        return new_array;
    },

    data : function (rows) {
        var data_rows = [];
        for (var i = 0; i < rows.length; i++) {
            var dataCells = rows[i].dataCells;
            var data_row = [];
            for (var cell_index = 0; cell_index < dataCells.length; cell_index++) {
                data_row.push(dataCells[cell_index].label);
                data_row.push(dataCells[cell_index].value);
                data_row.push('DELTA');
            }

            data_rows.push(data_row);
        }
        return data_rows;

    }
//[ "Tiger Nixon", "System Architect", "Edinburgh", "5421", "2011/04/25", "$320,800" ]


})
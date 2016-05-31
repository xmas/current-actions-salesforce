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

            //debugger;

            var store = JSON.parse(actionResult.getReturnValue());

            var headers = this.headersFromKey(store.headers, "label");
            console.log(headers);
            var data = this.data(store.data.rows);

            var col_hide_array = [];
            var col_vis_array = [];
            for (var i = 0; i < headers.length; i++) {
                if ((i % 3)){
                    col_hide_array.push(i);
                } else {
                    col_vis_array.push(i);                    
                }
            }            

            //console.log('vis cols: '+col_vis_array);
            //debugger;
            $('#example').DataTable( {                
                // "createdRow": function ( row, data, index ) {
                //     if ()
                //     $('td', row).eq(3).addClass('highlight');
                // },
                data: data,
                columns: headers,
                buttons: [
                'copy', 'excel', 'pdf'
                ],
                "columnDefs": [
                {
                    "render": function ( data, type, row, meta ) {
                        // START RENDER FUNCTION

                        // console.log('data: '+data);
                        // console.log('type: '+type);
                        // console.log('row: '+row);
                        // console.log('meta: '+meta);

                        //if(type === 'display') {
                            if (meta.col === 0) {
                                return '<a target="_blank" href="https://rowan-dev-ed.my.salesforce.com/'+row[meta.col+1]+'">'+data+'</a>';
                            } else {      

                                var delta = row[meta.col+2];
                                if (delta != 0) {
                                    if (!_.isNumber(delta)) {
                                        delta = delta.old;
                                    }

                                    return '<span class="wrapper"style="color:red; font-weight:900">'+data+'<div class="tooltip"> &Delta; '+delta+'</div></span>';
                                }
                                return data;

                            }

                        // END RENDER FUNCTION
                    },
                    "targets": col_vis_array
                },
                { "visible": false,  "targets": col_hide_array}
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
                if (dataCells[cell_index].delta) {
                    data_row.push(dataCells[cell_index].delta);
                    console.log(JSON.stringify(dataCells[cell_index].delta, null, 4));
                } else {
                    data_row.push('0');
                }
            }

            data_rows.push(data_row);
        }
        return data_rows;

    }
//[ "Tiger Nixon", "System Architect", "Edinburgh", "5421", "2011/04/25", "$320,800" ]


})
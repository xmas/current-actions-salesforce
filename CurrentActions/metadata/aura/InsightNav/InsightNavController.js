({
	doInit: function(component, event, helper) {

		helper.getTypes(component);
		helper.getReports(component);
        helper.getTypeLabels(component);
	},

    searchKeyChange: function(component, event, helper) {
       console.log('in InsightNavController:searchKeyChange');
       var searchKey = event.getParam("searchKey");
       console.log('in InsightNavController:searchKeyChange, got searchKey: '+searchKey);

       var reports_base = component.get("v.reports-base");
       var types_base = component.get("v.typedata-base");

       if (searchKey === "") {
            // reset the sidebar
             console.log("reset sidebar types: "+ types_base.length);

            component.set("v.reports", reports_base);
            component.set("v.typedata", types_base);
          //  debugger;
            //  console.log('in InsightNavController:searchKeyChange -- setting to base');
            // helper.getReports(component);
            // helper.getTypes(component);
            //  console.log('in InsightNavController:searchKeyChange -- finished setting to base');
            return;
        }

        console.log('in InsightNavController:searchKeyChange -- there is a search key so now we go and see what we can match');

        console.log("Search Key Change: "+searchKey);


        component.set("v.reports", null);
        component.set("v.typedata", null);


        // search for matches

        var reports_filtered = [];
        var typedata_filtered = [];

        for (var i = 0; i < reports_base.length; i++) {
            var report = reports_base[i];
            if (report["Data_Source__c"].startsWith(searchKey)) {
                reports_filtered.push(report);
            }
        }

        for (var i = 0; i < types_base.length; i++) {
            var type = types_base[i];
            if (type["fieldName"].startsWith(searchKey)) {
                typedata_filtered.push(type);
            }
        }

        var reportNames = reports_filtered.map(
            function(a) {
                return a.Data_Source__c;
            });


        var typeNames = typedata_filtered.map(
            function(a) {
                return a.fieldName;
            });


        console.log(searchKey+ ' --pushing to reports: ' + reportNames);
        console.log(searchKey+ ' --pushing to types: '+typeNames);

        component.set("v.reports", reports_filtered);
        component.set("v.typedata", typedata_filtered);


    },

     onSearchKeyChange: function(component, event, helper) {
       var searchKey = event.getParam("searchKey");
       var reports_base = component.get("v.reports-base");
       var types_base = component.get("v.typedata-base");

       if (searchKey === "") {
            component.set("v.reports", reports_base);
            return;
        }

        var reports_filtered = [];
        var typedata_filtered = [];

        for (var i = 0; i < reports_base.length; i++) {
            var report = reports_base[i];
            if (report["Data_Source__c"].startsWith(searchKey)) {
                reports_filtered.push(report);
            }
        }

        for (var i = 0; i < types_base.length; i++) {
            var type = types_base[i];
            if (type["fieldName"].startsWith(searchKey)) {
                typedata_filtered.push(type);
            }
        }

        component.set("v.reports", reports_filtered);
        component.set("v.typedata", typedata_filtered);


    }

})
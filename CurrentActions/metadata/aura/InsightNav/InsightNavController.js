({
	doInit: function(component, event, helper) {

		helper.getTypes(component);
		helper.getReports(component);

	},

    searchKeyChange: function(component, event, helper) {
        var searchKey = event.getParam("searchKey");
        if (searchKey === "") {
            // reset the sidebar
            // console.log("reset sidebar types: "+ types_base.length);
            // component.set("v.reports", reports_base);
            // component.set("v.typedata", types_base);
            //debugger;
            helper.getReports();
            helper.getTypes();
            return;
        }

        console.log("Search Key Change: "+searchKey);
        var reports_base = component.get("v.reports-base");
        var types_base = component.get("v.typedata-base");


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

        component.set("v.reports", reports_filtered);
        component.set("v.typedata", typedata_filtered);


    }
})


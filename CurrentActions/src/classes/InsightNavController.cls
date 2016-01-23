public with sharing class InsightNavController {

	public class TypeData {
		public String fieldName {get; set;}
		public String fieldValue {get; set;}
		public Boolean isHyperlink {get; set;}
        public Integer count {get; set;}
        public TypeData() {

            //   
            isHyperLink=true;
        }
    }

    @AuraEnabled
    public static List<AggregateResult> getReports () {
        return [SELECT ReportID__c, Data_Source__c, count(Id)  FROM Insight__c WHERE ReportID__c != null GROUP BY ReportID__c, Data_Source__c];
    }

    @AuraEnabled
    public static String getTypeData () {

        List <AggregateResult> assocIdCount = [SELECT  count(Id), AssocID__c FROM Insight__c WHERE AssocID__c != null GROUP BY AssocID__c ];
        Map <String, Integer> assocCounts = new Map <String, Integer> ();
        for (Integer i = 0; i < assocIdCount.size(); i++) {
            assocCounts.put(String.valueOf(assocIdCount[i].get('AssocID__c')), Integer.valueOf(assocIdCount[i].get('expr0')));
        }

        List <Insight__c> assocs = [SELECT Id, AssocTypeName__c, AssocID__c FROM Insight__c WHERE AssocID__c != null];
        Map <String, String> assoc_ids = new Map <String, String> ();
        for (Insight__c assoc : assocs) {
            assoc_ids.put(assoc.AssocID__c, assoc.AssocTypeName__c);
        }

        Map <String, List<TypeData>> typeVals = new Map <String, List<TypeData>> ();

        for (String assoc_id : assoc_ids.keySet()) {

            //
            Id asID = Id.valueOf(assoc_id);
            Schema.SObjectType token = asID.getSObjectType();
            Schema.DescribeSObjectResult dr = token.getDescribe();
            String type = dr.getLabelPlural();
            String queryString = 'SELECT Id, Name FROM ' + dr.getName() +' WHERE Id=\'' + assoc_id +'\'';

            SObject[] objDBList = Database.query(queryString);

            for(Integer i=0;i<objDBList.size();i++) {
                TypeData tdata = new TypeData();
                tdata.fieldName = (String)objDBList[i].get('Name');
                tdata.fieldValue = objDBList[i].Id;
                tdata.count = assocCounts.get(tdata.fieldValue);

                List<TypeData> tdlist  = null;
                if (typeVals.containsKey(type)) {
                    //
                    tdlist = (List<TypeData>)typeVals.get(type);

    			//
    			} else {
    				tdlist = new List<TypeData> ();
    			}
    			tdlist.add(tdata);
    			typeVals.put(type, tdlist);
    		}
    	}


    	List <String> types = new List<String> ();
    	types.addAll(typeVals.keySet());
    	types.sort();

    	List <TypeData> returnVals = new List<TypeData> ();
    	for (String type : types) {

    		TypeData tdata = new TypeData();
    		tdata.fieldName = type;
    		tdata.isHyperlink = false;
    		returnVals.add(tdata);


    		List<TypeData> dataList = typeVals.get(type);
    		for (TypeData data : dataList) {
    			returnVals.add(data);
    		}
    	}

    	//for (String type : types) {
    	//	System.debug('Type: '+type);
    	//	List<TypeData> dataList = typeVals.get(type);
    	//	for (TypeData data : dataList) {
    	//		System.debug('name: '+data.fieldName+' val: '+data.fieldValue);
    	//	}
    	//}

    	return JSON.serialize(returnVals);
    }

}
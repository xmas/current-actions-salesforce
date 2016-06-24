public with sharing class InsightNavController extends InsightsController {

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
	public static String getUserName() {
		return UserInfo.getUserName();
	}

	@AuraEnabled
	public static String totalInsightCount() {
		Integer count = [SELECT count() from Insight__c where Type__c != null];
		return String.valueOf(count);
	}

	@AuraEnabled
	public static List<Insight__c> getInsights() {
		return InsightsController.getInsights();
	}

	@AuraEnabled
	public static List<Insight__c> getInsightsForSourceAndField(String source, String field) {
		return InsightsController.getInsightsForSourceAndField( source,  field);
	}

	@AuraEnabled
	public static List<Insight__c> getInsightsForSource(String source) {
		return InsightsController.getInsightsForSource(source);
	}

	@AuraEnabled
	public static List<AggregateResult> getFieldsForSource (String data_source) {

		return [SELECT count(Id), Field_Labels__c from Insight__c WHERE Data_Source__c =:data_source GROUP BY Field_Labels__c];
	}

	@AuraEnabled
	public static List<AggregateResult> getSources () {
		Id user_id = UserInfo.getUserId();
		return [SELECT Data_Source__c, count(Id)  FROM Insight__c WHERE (Type__c != null) GROUP BY  Data_Source__c];
	}

	@AuraEnabled
	public static List<AggregateResult> getReports () {
		Id user_id = UserInfo.getUserId();
		return [SELECT ReportID__c, Data_Source__c, count(Id)  FROM Insight__c WHERE (ReportID__c != null) AND (AssocID__c =:user_id OR Assoc2ID__c =:user_id OR Assoc3ID__c =:user_id) GROUP BY ReportID__c, Data_Source__c];
	}

	@AuraEnabled
	public static List<AggregateResult> getTypeLabels () {
		Id user_id = UserInfo.getUserId();
		return [SELECT Report_Type_Label__c, count(Id)  FROM Insight__c WHERE (Report_Type_Label__c != null) AND (AssocID__c =:user_id OR Assoc2ID__c =:user_id OR Assoc3ID__c =:user_id) GROUP BY Report_Type_Label__c];
	}


	public static void addTypeDataToList(Map <String, List<TypeData>> typeVals, TypeData typeData, String type) {

		List<TypeData> tdlist  = null;
		if (typeVals.containsKey(type)) {
			tdlist = (List<TypeData>)typeVals.get(type);

		//
		} else {
			tdlist = new List<TypeData> ();
		}

		tdlist.add(typeData);
		typeVals.put(type, tdlist);

	}

	public static void processAssoc(String assoc_id, String assoc_name, String assoc_label, Map <String, List<TypeData>> typeVals, Map <String, Integer> assocCounts, Map<String, Integer> added_ids) {

		if (assoc_id != null && assoc_name != null) {

			if (!added_ids.containsKey(assoc_id)) {
				TypeData tdata = new TypeData();
				tdata.fieldName = assoc_label;
				tdata.fieldValue = assoc_id;
				tdata.count = assocCounts.get(assoc_id);

				addTypeDataToList(typeVals, tdata, assoc_name);
				added_ids.put(assoc_id, 1);
			}
		}
	}

	@AuraEnabled
	public static String getTypeData () {

		Map <String, Integer> assocCounts = new Map <String, Integer> ();

		// one
		//List <AggregateResult> assocIdCount = [SELECT  count(Id), AssocID__c FROM Insight__c WHERE AssocID__c != null GROUP BY AssocID__c ];
		Id user_id = UserInfo.getUserId();

		List <AggregateResult> assocIdCount = [SELECT  count(Id), AssocID__c FROM Insight__c WHERE (AssocID__c != null) AND ( AssocID__c = :user_id OR Assoc2ID__c = :user_id OR Assoc3ID__c = :user_id) GROUP BY AssocID__c ];

		for (Integer i = 0; i < assocIdCount.size(); i++) {
			assocCounts.put(String.valueOf(assocIdCount[i].get('AssocID__c')), Integer.valueOf(assocIdCount[i].get('expr0')));
		}

		// two
		//        assocIdCount = [SELECT  count(Id), Assoc2ID__c FROM Insight__c WHERE Assoc2ID__c != null GROUP BY Assoc2ID__c ];
		assocIdCount = [SELECT  count(Id), Assoc2ID__c FROM Insight__c WHERE (Assoc2ID__c != null) AND ( AssocID__c = :user_id OR Assoc2ID__c = :user_id OR Assoc3ID__c = :user_id)  GROUP BY Assoc2ID__c ];

		System.debug(assocIdCount);
		for (Integer i = 0; i < assocIdCount.size(); i++) {
			String key = String.valueOf(assocIdCount[i].get('Assoc2ID__c'));
			Integer count = Integer.valueOf(assocIdCount[i].get('expr0'));
			Integer current_count = Integer.valueOf(assocCounts.get(key));
			if (current_count == null) {
				current_count = 0;
			}

			assocCounts.put(key, count + current_count);
			//System.debug('key: '+key+' count: '+count+' current_count: '+current_count+' final: '+assocCounts.get(key));
		}

		// three
		//assocIdCount = [SELECT  count(Id), Assoc3ID__c FROM Insight__c WHERE Assoc3ID__c != null GROUP BY Assoc3ID__c ];
		assocIdCount = [SELECT  count(Id), Assoc3ID__c FROM Insight__c WHERE (Assoc3ID__c != null) AND ( AssocID__c = :user_id OR Assoc2ID__c = :user_id OR Assoc3ID__c = :user_id) GROUP BY Assoc3ID__c ];

		System.debug(assocIdCount);
		for (Integer i = 0; i < assocIdCount.size(); i++) {
			String key = String.valueOf(assocIdCount[i].get('Assoc3ID__c'));
			Integer count = Integer.valueOf(assocIdCount[i].get('expr0'));
			Integer current_count = Integer.valueOf(assocCounts.get(key));
			if (current_count == null) {
				current_count = 0;
			}

			assocCounts.put(key, count + current_count);
			//System.debug('key: '+key+' count: '+count+' current_count: '+current_count+' final: '+assocCounts.get(key));
		}


		Map <String, List<TypeData>> typeVals = new Map <String, List<TypeData>> ();
		Map<String, Integer> added_ids = new Map <String, Integer> ();

		List <Insight__c> assocs = [SELECT Id, AssocID__c, Assoc2ID__c, Assoc3ID__c, AssocTypeName__c, AssocTypeName2__c, AssocTypeName3__c, AssocLabel__c, AssocLabel2__c, AssocLabel3__c FROM Insight__c WHERE (AssocID__c != null) AND ( AssocID__c = :user_id OR Assoc2ID__c = :user_id OR Assoc3ID__c = :user_id)];
		for (Insight__c assoc : assocs) {

			processAssoc(assoc.AssocID__c, assoc.AssocTypeName__c, assoc.AssocLabel__c, typeVals, assocCounts, added_ids);
			processAssoc(assoc.Assoc2ID__c, assoc.AssocTypeName2__c, assoc.AssocLabel2__c, typeVals, assocCounts, added_ids);
			processAssoc(assoc.Assoc3ID__c, assoc.AssocTypeName3__c, assoc.AssocLabel3__c, typeVals, assocCounts, added_ids);

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

		for (String type : types) {
			System.debug('Type: '+type);
			List<TypeData> dataList = typeVals.get(type);
			for (TypeData data : dataList) {
				System.debug('name: '+data.fieldName+' val: '+data.fieldValue+' count: '+data.count);
			}
		}

		return JSON.serialize(returnVals);
	}


}
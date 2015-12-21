public with sharing class DataBot {

	public static List <DataBotObjectFieldTuple> getTuplesForType(Schema.DisplayType displayType) {

		Map<String, Schema.SObjectType> gd = Schema.getGlobalDescribe();
		List <DataBotObjectFieldTuple> matchingTypes = new List <DataBotObjectFieldTuple> ();
		for (String key : gd.keySet()) {

		    SObjectType objType = gd.get(key);
		    String objectName = objType.getDescribe().getLabel();
		    //System.debug('NAME: '+objectName);

		    for (Schema.SObjectField field: objType.getDescribe().fields.getMap().values()){
		        Schema.DisplayType fieldType = field.getDescribe().getType();
                //if (field.getDescribe().getName().endsWith('Name'))
                  //  System.debug('Object Name= '+objectName+' API Field Name =  '+field.getDescribe().getName()+' ---API Field Type= '+fieldType.name());
                

		        if (fieldType == displayType) {

					DataBotObjectFieldTuple tuple = new DataBotObjectFieldTuple(objType, field);
					matchingTypes.add(tuple);
		        }
		    }
		}
		return matchingTypes;
	}

     public static Map <String, Object> mapFromJSON (String serializedJSON) {
        Map <String, Object> params;
        if (serializedJSON != null ) {
            params = (Map <String, Object>) JSON.deserializeUntyped(serializedJSON);
        } else {
            params = new Map <String, Object> ();
        }
        return params;
    }
    
    public static Map <String, Object> childMapForKey (Map <String, Object> parentMap, String key) {
        
        Map <String, Object> childMap;
        if (parentMap.containsKey(key)) {
            childMap = (Map <String, Object>)parentMap.get(key);
        }	else {
            childMap = new Map<String, Object>();
        }
        return childMap;
    }
    
    public static List <Object> childListForKey (Map <String, Object> parentMap, String key) {
        
       List <Object> childList;
        if (parentMap.containsKey(key)) {
            childList = (List <Object>)parentMap.get(key);
        }	else {
            childList = new List <Object> ();
        }
        return childList;
    }
    
    public static Insight__c createInsight (String name, 
                                            String data_source, 
                                            String data_source_icon_url, 
                                            String details ) 
    {

        Insight__c insight = new Insight__c(
            Long_Name__c = name,
            Data_Source__c = data_source,
            Data_Source_Icon_URL__c = data_source_icon_url,
            Details__c = details
        );
        insert insight;
        if (insight.Id == null) {
            System.debug('Insight creation for: '+name+' failed');
            //return null;
        } else {
            //System.debug('NEW INSIGHT CREATED WITH ID: '+insight.Id);
        }
        
        
        DateTime currentTime = system.now();
        currentTime.addMinutes(45);
        

        Map <String, Object> payload = new Map <String, Object> ();

        payload.put('title', insight.Data_Source__c);
        payload.put('subtitle', insight.Long_Name__c);
        payload.put('message', insight.Details__c);
        payload.put('icon', 'http://www.google.com/someIcon.png');
        
        String cdate = currentTime.format('yyyy-MM-dd');
        String ctime = currentTime.format('HH:mm:ss');
        payload.put('expiration',  cdate+'T'+ctime);
        
        payload.put('notificationAppURL', 'https://rowan-dev-ed.my.salesforce.com/'+insight.Id);
        payload.put('mimeType', 'text/plain');
        payload.put('messageType', 'Alert');
        
        List <Map<String, String>> mediums = new List <Map<String, String>> ();
        mediums.add(new Map<String, String>{'name'=>'chrome'});
        payload.put('mediums', mediums);

        List <Map<String, String>> users = new List <Map<String, String>> ();
        users.add(new Map<String, String>{'guid'=>'123456'});
        users.add(new Map<String, String>{'guid'=>'987654'});
        payload.put('users', users);

        //System.debug('PUSH DATA:');
        AsyncPush push = new AsyncPush();
        String payload_s = JSON.serialize(payload);
        push.payload = payload_s;
        //System.debug(push);
       	System.debug('queiung: '+payload_s);

        System.enqueueJob(push);

         
		
        return insight;

	}
    
    public static InsightAssociation__c createInsightAssociation (Insight__c insight, 
                                                                  String recordID, 
                                                                  String name) {
        
        InsightAssociation__c association = new InsightAssociation__c(
            Name = name,
            Insight__c = insight.Id,
            RecordID__c = recordID
        );
        
		insert association;
		if (association.Id == null) {
			System.debug('association creation for: '
                         +insight.Long_Name__c
                         +' and '
                         +recordID
                         +' failed');
        } else {
            System.debug('NEW ASSOCIATION CREATED WITH ID: '+insight.Long_Name__c+' and '+recordID);
        }
		return association;
    }
    
    
	public DataBot() {

	}
}
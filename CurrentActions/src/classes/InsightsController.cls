public class InsightsController {
    
    @AuraEnabled
    public static List <Insight__c> getInsight (Id recordID) {
        System.debug('find the insight for the page we\'re on: '+recordID);
              return [SELECT Id, 
                Long_Name__c, 
                Data_Source__c, 
                Details__c, 
                LastModifiedDate,
                Data_Source_Icon_URL__c, 
                Directly_Responsible_User__c, 
                OwnerId, Chart__c
                FROM Insight__c 
                WHERE Id =:recordID];
    }
    
    @AuraEnabled
    public static List<Insight__c> getInsights() {
        return [SELECT Id, 
                Long_Name__c, 
                Data_Source__c, 
                Details__c, 
                LastModifiedDate,
                Data_Source_Icon_URL__c, 
                Directly_Responsible_User__c, 
                OwnerId, Chart__c
                FROM Insight__c 
                ORDER BY CreatedDate DESC LIMIT 20];
    }
    
    @AuraEnabled
    public static List<InsightAssociation__c> getInsightsForRecord( Id recordID ) {
        
        return [SELECT RecordID__c, 
                Insight__r.Long_Name__c,
                Insight__r.Data_Source__c, 
                Insight__r.Details__c, 
                Insight__r.LastModifiedDate,
                Insight__r.Data_Source_Icon_URL__c, 
                Insight__r.Directly_Responsible_User__c, 
                Insight__r.OwnerId, Insight__r.Chart__c, 
                Insight__r.Name 
                FROM InsightAssociation__c 
                WHERE RecordID__c = :recordID
                ORDER BY CreatedDate DESC LIMIT 3];
        
    }
    
    @AuraEnabled
    public static Integer getFeedItemCountForObject(String object_id) {
        return [SELECT count() FROM FeedItem WHERE ParentId =:object_id];
    }

    
    
    
}
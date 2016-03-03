public class InsightsController {


  public static String typeNameForID (String assoc_string) {

    Id assoc_id = Id.valueOf(assoc_string);
    Schema.SObjectType token = assoc_id.getSObjectType();
    Schema.DescribeSObjectResult dr = token.getDescribe();
    return dr.getLabelPlural();
  }

  static String insightQueryString = 'SELECT Id, Long_Name__c, Data_Source__c, Details__c, LastModifiedDate, Directly_Responsible_User__c, OwnerId, Chart__c, Parents__c, Table_Data__c, ReportID__c, Report_Type_Label__c FROM Insight__c';


  @AuraEnabled
  public static List <Insight__c> getInsight (Id recordID) {
    String query = insightQueryString + ' WHERE Id = \''+recordID+'\'';
    return Database.query(query);
  }

  @AuraEnabled
  public static List<Insight__c> getInsights() {

    Id user_id = UserInfo.getUserId();

   String query = insightQueryString + ' WHERE AssocID__c = \''+user_id+'\' OR Assoc2ID__c = \''+user_id+'\' OR Assoc3ID__c = \''+user_id+'\' ORDER BY CreatedDate DESC LIMIT 25';
   return Database.query(query);
 }

 @AuraEnabled
 public static Integer getFeedItemCountForObject(String object_id) {

  List <FeedItem> items = [SELECT Id, createdDate FROM FeedItem WHERE ParentId =:object_id];
  return items.size();
  // SELECT  ParentId,  Id, createdDate FROM FeedItem WHERE (ParentId IN ('a0E61000002N2oWEAS' , 'a0E61000002N2oXEAS')) and  GROUP BY ParentId

    //
  }

  @AuraEnabled
  public static List<Insight__c> getInsightsWithAssociation(String assoc_id) {

    Id user_id = UserInfo.getUserId();

    String query = insightQueryString + ' WHERE (AssocID__c = \''+assoc_id+'\' OR Assoc2ID__c = \''+assoc_id+'\' OR Assoc3ID__c = \''+assoc_id+'\') AND (AssocID__c = \''+user_id+'\' OR Assoc2ID__c = \''+user_id+'\' OR Assoc3ID__c = \''+user_id+'\') ORDER BY CreatedDate DESC LIMIT 25';

    return Database.query(query);

  }

  @AuraEnabled
  public static List<Insight__c> getInsightsByReport(Id report_id) {
    Id user_id = UserInfo.getUserId();
    String id_match = ' (AssocID__c = \''+user_id+'\' OR Assoc2ID__c = \''+user_id+'\' OR Assoc3ID__c = \''+user_id+'\') ';
    String query = insightQueryString + ' WHERE '+id_match+' AND (ReportID__c = \''+report_id+'\') ORDER BY CreatedDate DESC LIMIT 25';
    return Database.query(query);
  }

  @AuraEnabled
  public static List<InsightAssociation__c> getInsightsForRecord( Id recordID ) {
    return null;
  }

  @AuraEnabled
  public static List<Insight__c> getInsightsForTypeLabel (String labelID) {
    Id user_id = UserInfo.getUserId();
    String id_match = ' (AssocID__c = \''+user_id+'\' OR Assoc2ID__c = \''+user_id+'\' OR Assoc3ID__c = \''+user_id+'\') ';
    String query = insightQueryString + ' WHERE '+id_match+' AND (Report_Type_Label__c = \''+labelID+'\') ORDER BY CreatedDate DESC LIMIT 25';
    System.debug(query);
    return Database.query(query);

  }


}
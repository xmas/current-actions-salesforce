@isTest
public with sharing class InsightTest {


	public static testMethod void TESTtypeNameForID() {

        Account testInsight = new Account (Name = 'test');
        Test.startTest();

        insert testInsight;
        String pluralName = InsightsController.typeNameForID(String.valueOf(testInsight.Id));
        System.assertEquals(pluralName, 'Accounts');

        Test.stopTest();
    }

    public static testMethod void TESTgetFeedItemCountForObject() {

        Insight__c testInsight = new Insight__c (Name = 'test', Path__c = 'test/path');

        Test.startTest();

        insert testInsight;
        Integer count = InsightsController.getFeedItemCountForObject(testInsight.Id);
        System.assertEquals(count, 0);

        Test.stopTest();

    }


    public static testMethod void TESTgetInsightCounts() {

        Test.startTest();

        String controller_counts = InsightsController.getInsightCounts();
        String data_counts = InsightData.getInsightCounts();

        Map<String, Object> c_c = (Map<String, Object>)JSON.deserializeUntyped(controller_counts);
        Map<String, Object> d_c = (Map<String, Object>)JSON.deserializeUntyped(data_counts);

        Map<String, Object> c_c_all = (Map<String, Object>)c_c.get('all_users');
        Map<String, Object> d_c_all = (Map<String, Object>)d_c.get('all_users');


        System.assertEquals(c_c_all.get('total'), d_c_all.get('total'));


        Test.stopTest();

    }

    public static testMethod void TESTgetMaxUpdateCount() {

     Insight__c testInsight = new Insight__c (
        Name = 'test', 
        Path__c = 'test/path',
        Today_New__c = 5,
        Today_Changed__c = 3
        );

     Test.startTest();

     insert testInsight;
     Integer count = InsightsController.getMaxUpdateCount();
     System.assert(count > 0);

     Test.stopTest();
 }    

 public static testMethod void TESTgetInsight() {

    Insight__c testInsight = new Insight__c (Name = 'test', Path__c = 'test/path');
    Test.startTest();

    insert testInsight;
    List <Insight__c> insight_list = InsightsController.getInsight(testInsight.Id);
    System.assertEquals(insight_list[0].Id, testInsight.Id);

    Test.stopTest();
}

public static testMethod void TESTgetInsights() {

    Id user_id = UserInfo.getUserId();

    Insight__c testInsight = new Insight__c (
        Name = 'test', 
        Path__c = 'test/path',
        Today_New__c = 5,
        Today_Changed__c = 3,
        AssocID__c = user_id
        );

    Insight__c testInsight2 = new Insight__c (
        Name = 'test2', 
        Path__c = 'test2/path',
        Today_New__c = 5,
        Today_Changed__c = 3,
        AssocID__c = user_id
        );


    Test.startTest();

    insert testInsight2;
    insert testInsight;
    Boolean returned_one = FALSE;
    Boolean returned_two = FALSE;

    List <Insight__c> insight_list = InsightsController.getInsights();
    for (Insight__c returned_insight : insight_list) {
        if (returned_one && returned_two) {
            break;
        }

        if (returned_insight.Id == testInsight.Id) {
            System.assertEquals(returned_insight.Id, testInsight.Id);
            returned_one = TRUE;
        }   
        if (returned_insight.Id == testInsight2.Id) {
            System.assertEquals(returned_insight.Id, testInsight2.Id);
            returned_two = TRUE;
        }   

    }

    Test.stopTest();
}

public static testMethod void TESTgetInsightsWithAssociation() {

    Id user_id = UserInfo.getUserId();

    Insight__c testInsight = new Insight__c (
        Name = 'test', 
        Path__c = 'test/path',
        Today_New__c = 5,
        Today_Changed__c = 3,
        AssocID__c = user_id,
        Assoc2ID__c = user_id
        );

    Insight__c testInsight2 = new Insight__c (
        Name = 'test2', 
        Path__c = 'test2/path',
        Today_New__c = 5,
        Today_Changed__c = 3,
        AssocID__c = user_id,
        Assoc3ID__c = user_id
        );


    Test.startTest();

    insert testInsight2;
    insert testInsight;
    Boolean returned_one = FALSE;
    Boolean returned_two = FALSE;

    List <Insight__c> insight_list = InsightsController.getInsightsWithAssociation(user_id);
    for (Insight__c returned_insight : insight_list) {
        if (returned_one && returned_two) {
            break;
        }

        if (returned_insight.Id == testInsight.Id) {
            System.assertEquals(returned_insight.AssocID__c, testInsight.AssocID__c);
            System.assertEquals(returned_insight.Assoc2ID__c, testInsight.Assoc2ID__c);

            returned_one = TRUE;
        }   
        if (returned_insight.Id == testInsight2.Id) {
            System.assertEquals(returned_insight.AssocID__c, testInsight2.AssocID__c);
            System.assertEquals(returned_insight.Assoc3ID__c, testInsight2.Assoc3ID__c);

            returned_two = TRUE;
        }   

    }

    Test.stopTest();
}

public static testMethod void TESTgetInsightsByReport() {

    Id user_id = UserInfo.getUserId();


    Insight__c testInsight = new Insight__c (
        Name = 'test', 
        Path__c = 'test/path',
        Today_New__c = 5,
        Today_Changed__c = 3,
        AssocID__c = user_id,
        ReportID__c = user_id
        );

    Insight__c testInsight2 = new Insight__c (
        Name = 'test2', 
        Path__c = 'test2/path',
        Today_New__c = 5,
        Today_Changed__c = 3,
        AssocID__c = user_id,
        ReportID__c = user_id
        );


    Test.startTest();

    insert testInsight2;
    insert testInsight;
    Boolean returned_one = FALSE;
    Boolean returned_two = FALSE;

    List <Insight__c> insight_list = InsightsController.getInsightsByReport(user_id);
    for (Insight__c returned_insight : insight_list) {
        if (returned_one && returned_two) {
            break;
        }

        if (returned_insight.Id == testInsight.Id) {
            System.assertEquals(returned_insight.AssocID__c, testInsight.AssocID__c);
            System.assertEquals(returned_insight.ReportID__c, testInsight.ReportID__c);

            returned_one = TRUE;
        }   
        if (returned_insight.Id == testInsight2.Id) {
            System.assertEquals(returned_insight.AssocID__c, testInsight2.AssocID__c);
            System.assertEquals(returned_insight.ReportID__c, testInsight2.ReportID__c);

            returned_two = TRUE;
        }   

    }

    Test.stopTest();
}

public static testMethod void TESTgetInsightsForTypeLabel() {

    Id user_id = UserInfo.getUserId();


    Insight__c testInsight = new Insight__c (
        Name = 'test', 
        Path__c = 'test/path',
        Today_New__c = 5,
        Today_Changed__c = 3,
        AssocID__c = user_id,
        Report_Type_Label__c = 'that'
        );

    Insight__c testInsight2 = new Insight__c (
        Name = 'test2', 
        Path__c = 'test2/path',
        Today_New__c = 5,
        Today_Changed__c = 3,
        AssocID__c = user_id,
        Report_Type_Label__c = 'that'
        );


    Test.startTest();

    insert testInsight2;
    insert testInsight;
    Boolean returned_one = FALSE;
    Boolean returned_two = FALSE;

    List <Insight__c> insight_list = InsightsController.getInsightsForTypeLabel('that');
    for (Insight__c returned_insight : insight_list) {
        if (returned_one && returned_two) {
            break;
        }

        if (returned_insight.Id == testInsight.Id) {
            System.assertEquals(returned_insight.AssocID__c, testInsight.AssocID__c);
            System.assertEquals(returned_insight.Report_Type_Label__c, testInsight.Report_Type_Label__c);

            returned_one = TRUE;
        }   
        if (returned_insight.Id == testInsight2.Id) {
            System.assertEquals(returned_insight.AssocID__c, testInsight2.AssocID__c);
            System.assertEquals(returned_insight.Report_Type_Label__c, testInsight2.Report_Type_Label__c);

            returned_two = TRUE;
        }   

    }

    Test.stopTest();
}

public static testMethod void TESTgetUserName() {

   Test.startTest();

   System.assert(InsightsController.getUserName().length() > 0);

   Test.stopTest();

}

public static testMethod void TESTsetInsightReadStatus() {

  Insight__c testInsight = new Insight__c (
    Name = 'test', 
    Path__c = 'test/path',
    Is_Read__c = false
    );
  Test.startTest();

  insert testInsight;

  System.assert(!testInsight.Is_Read__c);
  System.assert(InsightsController.setInsightReadStatus(testInsight.Id, true));
  System.assert(!InsightsController.setInsightReadStatus(testInsight.Id, false));

  Test.stopTest();

}


public static testMethod void TESTgetFromS3() {

    CurrentActionsAdmin__c admin = new CurrentActionsAdmin__c(
        AWS_accessKeyId__c = '4444',
        AWS_secretAccessKey__c = '3453454353',
        AWS_region__c = 'us-west-2',
        Active__c = TRUE
        );
    insert admin;


    Test.startTest();

    StaticResourceCalloutMock mock = new StaticResourceCalloutMock(); 
    mock.setStaticResource('test_s3');
    mock.setStatusCode(200);
    mock.setHeader('Content-Type', 'application/json');
    Test.setMock(HttpCalloutMock.class, mock);


    String data = InsightsController.getFromS3('test');
    System.assert(data.length() > 0);

    Test.stopTest();
}


}
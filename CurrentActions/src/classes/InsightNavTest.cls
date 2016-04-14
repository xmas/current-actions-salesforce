@isTest
public with sharing class InsightNavTest {
	
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

        Boolean found = FALSE;
        List<AggregateResult> associated_reports = InsightNavController.getReports();
        for (AggregateResult agg : associated_reports) {
            if (agg.get('ReportID__c') == user_id) {
                found = TRUE;
                break;
            }

        }

        System.assert(found);

        Test.stopTest();
    }

    public static testMethod void TESTgetTypeLabels() {

        Id user_id = UserInfo.getUserId();

        Insight__c testInsight = new Insight__c (
            Name = 'test', 
            Path__c = 'test/path',
            Today_New__c = 5,
            Today_Changed__c = 3,
            AssocID__c = user_id,
            Report_Type_Label__c = 'user_id'
            );

        Insight__c testInsight2 = new Insight__c (
            Name = 'test2', 
            Path__c = 'test2/path',
            Today_New__c = 5,
            Today_Changed__c = 3,
            AssocID__c = user_id,
            Report_Type_Label__c = 'user_id'
            );


        Test.startTest();
        insert testInsight2;
        insert testInsight;

        Boolean found = FALSE;
        List<AggregateResult> associated_reports = InsightNavController.getTypeLabels();
        for (AggregateResult agg : associated_reports) {
            if (agg.get('Report_Type_Label__c') == 'user_id') {
                found = TRUE;
                break;
            }

        }

        System.assert(found);

        Test.stopTest();
    }

    public static testMethod void TESTgetTypeData() {

        Id user_id = UserInfo.getUserId();

        Insight__c testInsight = new Insight__c (
            Name = 'test', 
            Path__c = 'test/path',
            Today_New__c = 5,
            Today_Changed__c = 3,
            AssocID__c = user_id,
            Assoc2ID__c = user_id,
            Assoc3ID__c = user_id
            );

        Insight__c testInsight2 = new Insight__c (
            Name = 'test2', 
            Path__c = 'test2/path',
            Today_New__c = 5,
            Today_Changed__c = 3,
            AssocID__c = user_id,
            Assoc2ID__c = user_id,
            Assoc3ID__c = user_id
            );


        Test.startTest();
        insert testInsight2;
        insert testInsight;

        Boolean found = FALSE;
        String typeData = InsightNavController.getTypeData();

        System.assert(typeData.length() > 0);

        Test.stopTest();
    }


}
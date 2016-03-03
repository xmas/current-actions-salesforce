@isTest
public class InsightTest {


	public static testMethod void TESTtypeNameForID() {

        Account testInsight = new Account (Name = 'test');
        test.startTest();

        insert testInsight;
        String pluralName = InsightsController.typeNameForID(String.valueOf(testInsight.Id));
        System.assertEquals(pluralName, 'Accounts');

        test.stopTest();
	}
}
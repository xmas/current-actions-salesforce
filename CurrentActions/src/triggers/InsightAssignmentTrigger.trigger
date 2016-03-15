trigger InsightAssignmentTrigger on Insight__c (before insert, before update) {

	Map <String, Integer> lastVals = new Map <String, Integer> ();

	for (Insight__c new_insight : Trigger.new) {

		String one = new_insight.AssocID__c;
		if (one != null) {

			new_insight.AssocTypeName__c = InsightsController.typeNameForID(one);

		}

		String two = new_insight.Assoc2ID__c;
		if (two != null) {
			new_insight.AssocTypeName2__c = InsightsController.typeNameForID(two);
		}

		String three = new_insight.Assoc3ID__c;
		if (three != null) {
			new_insight.AssocTypeName3__c = InsightsController.typeNameForID(three);
		}

		System.debug('Assoc one: '+one+' Assoc label: '+new_insight.AssocLabel__c+' Assoc type name: '+new_insight.AssocTypeName__c);


		lastVals.put(new_insight.Path__c, 1);
	}

	List <Insight__c> flagged = new List <Insight__c> ();
	for (Insight__c old : [SELECT Id, Path__c FROM Insight__c]) {
		if (lastVals.containsKey(old.Path__c)) {
			flagged.add(old);
		}
	}
	delete flagged;
}
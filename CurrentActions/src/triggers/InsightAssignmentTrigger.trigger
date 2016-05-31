trigger InsightAssignmentTrigger on Insight__c (before insert, before update) {

	Map <String, Integer> lastVals = new Map <String, Integer> ();

	for (Insight__c new_insight : Trigger.new) {


		System.debug('ID: '+new_insight.Id+ ' Name: '+new_insight.Name+' Assoc one: '+new_insight.AssocID__c+' Assoc label: '+new_insight.AssocLabel__c+' Assoc two: '+new_insight.Assoc2ID__c+' Assoc label: '+new_insight.AssocLabel2__c);


		String one = new_insight.AssocID__c;
		if (one != null) {

			new_insight.AssocTypeName__c = InsightsController.typeNameForID(one);
			if (new_insight.AssocID__c.startsWith('005') ) {
				new_insight.Assigned_User__c = Id.valueOf(new_insight.AssocID__c);
			}

		}

		String two = new_insight.Assoc2ID__c;
		if (two != null) {
			new_insight.AssocTypeName2__c = InsightsController.typeNameForID(two);
		}

		String three = new_insight.Assoc3ID__c;
		if (three != null) {
			new_insight.AssocTypeName3__c = InsightsController.typeNameForID(three);
		}


		Insight__c old = null;
		String old_changed = null;
		String old_deleted = null;
		String old_newones = null;
		String old_total = null;
		String old_labels = null;

		if (Trigger.isUpdate && Trigger.oldMap.containsKey(new_insight.Id)) {
			old = Trigger.oldMap.get(new_insight.Id);

			old_changed = old.History_Changed__c;
			old_deleted = old.History_Deleted__c;
			old_newones = old.History_New__c;
			old_total = old.History_Total__c;
			old_labels = old.History_Labels__c;
		}		


		// changed
		List <Object> changed;
		if (old_changed != null) {
			changed = (List <Object>)JSON.deserializeUntyped(old_changed);
			} else {
				changed = new List <Object> ();
			}

		// deleted
		List <Object> deleted;
		if (old_deleted != null) {
			deleted = (List <Object>)JSON.deserializeUntyped(old_deleted);
			} else {
				deleted = new List <Object> ();
			}

		// new
		List <Object> newones;
		if (old_newones != null) {
			newones = (List <Object>)JSON.deserializeUntyped(old_newones);
			} else {
				newones = new List <Object> ();
			}

		// total
		List <Object> total;
		if (old_total != null) {
			total = (List <Object>)JSON.deserializeUntyped(old_total);
			} else {
				total = new List <Object> ();
			}

		// labels
		List <Object> labels;
		if (old_newones != null) {

			labels = (List <Object>)JSON.deserializeUntyped(old_labels);

		//
		} else {

			//
			labels = new List <Object> ();
		}

		Decimal new_change = new_insight.Today_Changed__c;
		if (new_change == null) {
			new_change = 0;
		}
		Decimal new_deleted = new_insight.Today_Deleted__c;
		if (new_deleted == null) {
			new_deleted = 0;
		}
		Decimal new_new = new_insight.Today_New__c;
		if (new_new == null) {
			new_new = 0;
		}
		Decimal new_total = new_insight.Today_Total__c;
		if (new_total == null) {
			new_total = 0;
		}

		changed.add(new_change);
		deleted.add(new_deleted);
		newones.add(new_new);
		total.add(new_total);

		labels.add(Date.today());
		new_insight.History_Labels__c = JSON.serialize(labels);

		new_insight.History_Changed__c = JSON.serialize(changed);
		new_insight.History_Deleted__c = JSON.serialize(deleted);
		new_insight.History_New__c = JSON.serialize(newones);
		new_insight.History_Total__c = JSON.serialize(total);



	}

	//List <Insight__c> flagged = new List <Insight__c> ();
	//for (Insight__c old : [SELECT Id, Path__c FROM Insight__c]) {
	//	if (lastVals.containsKey(old.Path__c)) {
	//		flagged.add(old);
	//	}
	//}
	//delete flagged;
	//lastVals.put(new_insight.Path__c, 1);

}
public with sharing class LedgerBotFactory {

	public static LedgerBot__c getLedgerBot(String ledgerBotName) {

		// must assign to list in order to check for null
		List <LedgerBot__c> existingLedgerBots = [SELECT Id, Name, Calculator__c, Last_Result__c, Last_Result_Time__c FROM LedgerBot__c WHERE LedgerBot__c.Name = :ledgerBotName];
		LedgerBot__c ledgerBot = null;

		if (existingLedgerBots.size() == 0) {
		    System.debug('Create a new Ledger Bot for: '+ ledgerBotName);

		    // create a new LedgerBot
		    LedgerBot__c newLedgerBot = new LedgerBot__c(
		        Name = ledgerBotName
		    );

		    try {
		      insert newLedgerBot;
		    }
		    catch(DmlException e) {
		        System.debug('An unexpected error has occurred on LedgerBot creation: ' + e.getMessage());
		    }

		    ledgerBot = [SELECT Id, Name, Calculator__c, Last_Result__c, Last_Result_Time__c FROM LedgerBot__c WHERE LedgerBot__c.Name = :ledgerBotName];
		    if (ledgerBot != null) {
		      System.debug('New LedgerBot create for: '+ ledgerBotName +  'Id: ' + ledgerBot.Id);
					return LedgerBot;
		    } else {
		      System.debug('New LedgerBot FAILED TO create for: '+ ledgerBotName);
					return null;
		    }
		} else {
		  return (LedgerBot__c)existingLedgerBots.get(0);
		  System.debug('found existing Ledget Bot: '+ ledgerBot.Name);
		}
		return null;
	}
}
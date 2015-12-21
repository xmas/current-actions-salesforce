public class LedgerBot {

    Map <String, LedgerBot__c> ledgerBots;
    
    public LedgerBot () {
        
        ledgerBots = new Map <String, LedgerBot__c> ();
		for (LedgerBot__c ledgerBot : [SELECT Id, Name, 
                                       Calculator__c, 
                                       Last_Result__c, 
                                       Last_Result_Time__c 
                                       FROM LedgerBot__c] ) 
        {
        	ledgerBots.put(ledgerBot.Name, ledgerBot);
        }

    }
    
    public void commitLedgerBots () {
        try {
	        upsert ledgerBots.values();
        } catch(DmlException e) {
            System.debug('An unexpected error has occurred on LedgerBot creation: ' + e.getMessage());
        }
    }
    
    public LedgerBot__c getLedgerBotByName(String bot_name) {
        if (ledgerBots.containsKey(bot_name)) {
            return ledgerBots.get(bot_name);	
        }
        
        LedgerBot__c newLedgerBot = new LedgerBot__c(
            Name = bot_name
        );
        ledgerBots.put(bot_name, newLedgerBot);
        return newLedgerBot;
    }
    
}
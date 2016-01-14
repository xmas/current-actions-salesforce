public class AccountContactClass {
 
    @AuraEnabled
    public static List<Account> getLstAccounts() {                      
        return [select id,Name from Account];
    }
   
    @AuraEnabled
    public static List<Contact> getLstContact(String accountId) {                      
        return [select id,Name,Phone,Email,Account.Name from contact where AccountID=:accountId];
    }
}
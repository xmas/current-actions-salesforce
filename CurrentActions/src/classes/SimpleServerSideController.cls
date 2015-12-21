public class SimpleServerSideController {

    @AuraEnabled
    public static String serverEcho(String firstName) {
        return('Hello00 from the server: '+firstName);
    }
    
}
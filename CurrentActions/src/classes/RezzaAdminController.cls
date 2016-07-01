public class RezzaAdminController {

    public String currentPage {get{
        return URL.getSalesforceBaseUrl().toExternalForm() + ApexPages.currentPage().getURL();
    }
                               set;}
    
}
public class AsyncChart implements Queueable, Database.AllowsCallouts {

    public Insight__c insight; 
    public String chart_options;
    
    public void execute(QueueableContext context) {
        HttpRequest req = new HttpRequest();
        req.setEndpoint(chart_options);
        req.setMethod('GET');
        Http http = new Http();
        HTTPResponse res = http.send(req);
        Blob image = res.getBodyAsBlob();
        String base64 =  'data:'+res.getHeader('Content-Type')+';base64,'+EncodingUtil.base64Encode(image);
        System.debug(base64);
        insight.Chart__c = '<img alt=\"Generated Chart\" src='+base64+'></img>';
        upsert insight;
    }    
}
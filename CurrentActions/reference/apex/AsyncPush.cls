public class AsyncPush implements Queueable, Database.AllowsCallouts {

    public String payload;
    
    public void execute(QueueableContext context) {

        HttpRequest req = new HttpRequest();
        req.setEndpoint('http://pushserver.currentactions.com:8080/push/messages/v1');
        req.setMethod('POST');
        req.setBody(payload);
        req.setHeader('content-type', 'application/json');
        
        Http http = new Http();
        HTTPResponse res = http.send(req);
        System.debug(res.getBody());
    }    
}
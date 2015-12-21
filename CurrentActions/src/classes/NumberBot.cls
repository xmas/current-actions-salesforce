public with sharing class NumberBot {

    public enum csvtype {CSVSTRING, CSVCURRENCY, CSVNUMBER, CSVDATE}
    
    public NumberBot(String csvURL) {
     
        HttpRequest req = new HttpRequest();
        req.setEndpoint(csvURL);
        req.setMethod('GET');
        Http http = new Http();
        HTTPResponse res = http.send(req);
        String csvString = res.getBody();
                
        List<List<String>> rows = CSVReader.parse(csvString);
        List <String> header = rows.remove(0);
        List <csvtype> types = typesForValues(rows[0]);
        Map <String, Decimal[]> numberColumns;
        for (List<String> row : rows) {
      
            System.debug(row);
            
            
        }        
    }
    
    public List<csvtype> typesForValues (List <String> row) {
        List <csvtype> types = new List <csvtype> ();
        Pattern datePattern = Pattern.compile('\\(d{4})-(\\d{2})-(\\d{2})');

        for (Integer i = 0; i < row.size(); i++) {
            String val = row[i];
            
            if (val.startsWith('$')) {
                types[i] = csvtype.CSVCURRENCY;
            } else if (val.isNumeric()) {
                types[i] = csvtype.CSVNUMBER;
            } else if (datePattern.matcher(val).matches() ) {
                types[i] = csvtype.CSVDATE;
            } else {
                types[i] = csvtype.CSVSTRING;
            }
        }
        return types;        
    }
    
    public Decimal decimalForCurrency (String money) {
        if (money.contains(',')) {
            money = money.replaceall(',','');
        }
        Pattern dollarPattern = Pattern.compile('[\\p{Sc}]');
        String s = dollarPattern.matcher(money).replaceAll('');
        Decimal d = Decimal.valueof(s);
        return d;
    }
    
}
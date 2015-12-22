public with sharing class NumberBot 
{

    public enum csvtype {CSVSTRING, CSVCURRENCY, CSVNUMBER, CSVDATE}
    
    public NumberBot(String csvURL) {

        HttpRequest req = new HttpRequest();
        req.setEndpoint(csvURL);
        req.setMethod('GET');
        Http http = new Http();
        HTTPResponse res = http.send(req);
        String csvString = res.getBody();


        Map<String, Account> accounts = new Map<String, Account>(); 
        for(Account objCS : [Select Account.Name, Account.Id From Account] ) {
            accounts.put(objCS.Name, objCS);
        }

        SSSCsvReader reader = new SSSCsvReader(csvString);

        String[] names = new List<String> ();
        String[] emails = new List<String> ();




        String[] header = reader.readLine();
        String[] row = reader.readLine();
        csvtype[] types = typesForValues(row);

        while (row != null) {
            Integer count = 0;

            for (Integer i = 0; i < row.size(); i++ ) {
                System.debug(types[i]+' : '+header[i]+' : '+row[i]);

                if ( header[i].toLowerCase().contains('email') ) {
                    // add to email list
                    emails.add(row[i]);
                }

                if ( header[i].toLowerCase().contains('name') ) {
                    // add to email list
                    names.add(row[i]);
                }

                if (header[i].endsWith('Client')) {
                    System.debug(accounts.get(row[i]));
                    // create association
                }

            }

            row = reader.readLine();
        }

        String tableHTML = buildTable(new List<String> {'Name', 'Email'}, new List<String[]>  {names, emails});
        String mailAll = '<a href="mailto:'+String.join(emails, ',')+'">Email Group</a>';
        
        Insight__c insight = DataBot.createInsight('Available Resources', 'Resource Bot', '', mailAll);
        insight.Chart__c = tableHTML;
        upsert insight;


    }

    public String buildTable (List<String> headers, List<String[]> rows) {
        String html = '<div class="slds"><table class="slds-table slds-table--bordered"><thead> <tr class="slds-text-heading--label">';
        for (String header : headers) {
            html = html + '<th scope="col"><span class="slds-truncate">';

            html = html + header;
            html = html + '</span></th>';
        }
        html = html + '  </thead><tbody>';

        for (Integer i = 0; i < rows[0].size(); i++) {
            html = html + '<tr class="slds-hint-parent">';

            html = html + '<td data-label="'+headers[0]+'">';
            html = html + '<span class="slds-truncate">'+rows[0][i]+'</span></td>';

            html = html + '<td data-label="'+headers[1]+'">';
            html = html + '<a href="#" class="slds-truncate">'+rows[1][i]+'</a></td>';

            html = html + '</tr>';
        }



        html = html + '</tbody></table></div>';

        System.debug(html);

        return html;
    }

    public List<csvtype> typesForValues (List <String> row)  {


        List <csvtype> types = new csvtype[row.size()+1];
        Pattern datePattern = Pattern.compile('(\\d{4})-(\\d{2})-(\\d{2})');


        for (Integer i = 0; i < row.size(); i++) {
            System.debug(i+' : '+row[i]);
            String val = row[i];

            if (val.startsWith('$')) {
                types[i] = csvtype.CSVCURRENCY;
                System.debug('CURRENCY: '+val);
                } else if (val.isNumeric()) {
                    types[i] = csvtype.CSVNUMBER;
                    System.debug('NUMBER: '+val);

                    } else if (datePattern.matcher(val).matches() ) {
                        types[i] = csvtype.CSVDATE;
                        System.debug('DATE: '+val);
                        } else {
                            types[i] = csvtype.CSVSTRING;
                            System.debug('STRING: '+val);
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
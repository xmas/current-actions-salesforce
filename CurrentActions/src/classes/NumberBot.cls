public with sharing class NumberBot 
{

    public enum csvtype {CSVSTRING, CSVCURRENCY, CSVNUMBER, CSVDATE}
    
    public NumberBot(String csvURL) {

        String queryName = 'Available Resources';
        List <InsightAssociation__c> assocs = new  List <InsightAssociation__c> ();

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
        String[] clients = new List<String> ();


        String[] header = reader.readLine();
        String[] row = reader.readLine();
        csvtype[] types = typesForValues(row);
        Integer count = 0;

        while (row != null) {
            count++;
            for (Integer i = 0; i < row.size(); i++ ) {
                if ( header[i].toLowerCase().contains('email') ) {
                    // add to email list
                    emails.add(row[i]);
                }

                if ( header[i].toLowerCase().contains('name') ) {
                    // add to email list
                    names.add(row[i]);
                }

                if (header[i].endsWith('Client')) {
                    if (row[i].length() > 0) {
                        clients.add(row[i]);
                    }
                }

            }

            row = reader.readLine();
        }
        // end read rows

        String tableHTML = buildTable(new List<String> {'Name', 'Email'}, new List<String[]>  {names, emails});
        String mailAll = '<a href="mailto:'+String.join(emails, ',')+'">Email Group</a>';
        
        Insight__c insight = DataBot.createInsight('Available Resources', 'Resource Bot', '', mailAll+'<br></br>'+tableHTML);
        countCompare(queryName, insight, count);


        Set<String> clientSet =new Set<String>();
        clientSet.addAll(clients);
        System.debug(clientSet);
        for (String client : clientSet) {
            System.debug(client+' = '+accounts.get(client).Id);
            String aid = accounts.get(client).Id;
            InsightAssociation__c assoc = new InsightAssociation__c (
                Insight__c = insight.Id,
                RecordID__c = aid,
                Name = 'Available Resource for account'
                );
            assocs.add(assoc);
        }


        upsert insight;
        upsert assocs;

    }

    private void countCompare (String u_name, Insight__c insight, Integer count) {

        LedgerBot ledgers = new LedgerBot();
        System.debug('count: '+count);

        LedgerBot__c fieldLedgerBot = ledgers.getLedgerBotByName(u_name);
        String lastResultString = fieldLedgerBot.Last_Result__c;
        Map <String, Object> fieldParams = DataBot.mapFromJSON(lastResultString);

        List <Object> statsList = (List <Object>)fieldParams.get('stats');
        Map <String, Object> newStats = new Map <String, Object> ();
        newStats.put('date', system.now().formatGMT('EEE, MMM d yyyy HH:mm:ss'));
        newStats.put('count', count);
        statsList = Util.push(statsList, newStats);

         // repack the JSON
         fieldParams.put('stats', statsList);
        //System.debug(JSON.serialize(fieldParams));
        fieldLedgerBot.Last_Result__c = JSON.serialize(fieldParams);
        fieldLedgerBot.Last_Result_Time__c = system.now();
        upsert fieldLedgerBot;

        List<Integer> countHistory = new List<Integer> ();
        Integer min = 0;
        Integer max = -1;
        for (Integer i = statsList.size()-1; i >= 0 ; i--) {
            Map <String, Object> statEntry = (Map <String, Object>) statsList[i];
            Integer countE = Integer.valueOf(statEntry.get('count'));
            max = Math.max(max, countE);
            countHistory.add(countE);
        }

        System.debug(countHistory);
        if (max > 100) {
            for (Integer c = 0; c < countHistory.size(); c++) {
                if (countHistory[c] > 1) {
                    countHistory[c] = ((countHistory[c] - min)/(max-min))*100;
                }
            }
        }
        System.debug(countHistory);


        String chart_opts = 'https://chart.googleapis.com/chart?cht=lc&chco=0849A2&chs=600x300&chd=t:'+
        String.join(countHistory,',')+'&chxt=x,y&chxl=0:|Prev|Today|1:||'+min.format()+'||'+max.format();

        System.debug(chart_opts);

        AsyncChart ac = new AsyncChart();
        ac.insight = insight;
        ac.chart_options = chart_opts;
        System.enqueueJob(ac);


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

                } 
                else if (datePattern.matcher(val).matches() ) 
                {
                    types[i] = csvtype.CSVDATE;
                    System.debug('DATE: '+val);
                } 
                else {
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
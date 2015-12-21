public with sharing class CurrencyBot {
  
    LedgerBot ledgers;
    List <InsightAssociation__c> assocs;
    
    public CurrencyBot() {
 
        ledgers = new LedgerBot();
        assocs = new  List <InsightAssociation__c> ();
        
        // get all the SObjectTypes that have at least one Schema.DisplayType.Currency
        List <DataBotObjectFieldTuple> matchingTypes = DataBot.getTuplesForType(Schema.DisplayType.Currency);
        
        for (DataBotObjectFieldTuple tuple : matchingTypes) {

            String objectName = tuple.objType.getDescribe().getName();
            String fieldName = tuple.field.getDescribe().getName();
            String objField = objectName + '.' + fieldName;
            
            // skip list
            if (objField == 'DatacloudCompany.AnnualRevenue'
               || objectName == 'OpportunityHistory'
               || objectName == 'OrderItem'
               ) {
                continue;
            }
            
            if (objectName != 'Account') {
                continue;
            }
            

            // aggregate level, e.g. Account:AnnualRevenue
            compareFieldStats(objectName, fieldName, objField);
            
            // object level query
             String queryString = 'SELECT '+objectName+'.Name, '+objectName + '.Id, '+ objField + 
                 ' FROM '+ objectName + 
                 ' WHERE '+ objField + ' > 0 ORDER BY '+ objField + ' DESC';
          	 //System.debug(queryString);
            
            // object level comparison
            List <SObject> objs = Database.query(queryString);
            for (SObject inst : objs) {
                compareValues(objectName, fieldName ,objField, inst);
            }
        }
        
       ledgers.commitLedgerBots();
        upsert assocs;
    }
    
    // object level comaprison
    // creates a line graph and maybe a whisker chart as well...
    private void compareValues (String objectName,
                                String fieldName,
                                String objField,
                                SObject inst ) 
    {
        
        // get Ledger for the field 
        String ledgerName = objField+'.'+inst.Id;
        LedgerBot__c instanceLedgerBot = ledgers.getLedgerBotByName(ledgerName);
        //System.debug('PROCESSING: '+ledgerName);
        String lastResultString = instanceLedgerBot.Last_Result__c;
        Map <String, Object> fieldParams = DataBot.mapFromJSON(lastResultString);
        
        Double currentValue = Double.valueOf(inst.get(fieldName));
        
        // values
        List <Object> valList = DataBot.childListForKey(fieldParams, 'vals');
        List <Object> dateList = DataBot.childListForKey(fieldParams, 'dates');

        valList = Util.push(valList, currentValue);
        dateList= Util.push(dateList, system.now().formatGMT('EEE, MMM d yyyy HH:mm:ss'));

        // repack the JSON
        fieldParams.put('vals', valList);
        fieldParams.put('dates', dateList);
        
        Boolean create_insight = FALSE;
        String insight_name;
        String insight_details;
        Double min = -1;
        Double max = 0;
        
        // stats
        Map <String, Object> stats = DataBot.childMapForKey(fieldParams, 'stats');
        Double lastMaxValue = 0;
        if (stats.containsKey('max')) {
            lastMaxValue = Double.valueOf(stats.get('max'));
        } 
        
        if (currentValue > lastMaxValue) {
            stats.put('max', currentValue);
            create_insight = TRUE;
            insight_name = 'New maximum value for: '+objField+' : '+inst.get('Name')+' is '+currentValue;
            insight_details = '<ul><li>The new maximum value is: '+currentValue+'</li>'+
                'The old maximum value was: '+lastMaxValue+'</li>';
            max = currentValue;
        } else {
            max = lastMaxValue;
        }
        
        Double lastMinValue = -1;
        if (stats.containsKey('min')) {
            lastMinValue = Double.valueOf(stats.get('min'));
        } 
        
        if (currentValue < lastMinValue || lastMinValue == -1) {
            stats.put('min', currentValue);
            create_insight = TRUE;
            insight_name = 'New minumum value for: '+objField+' : '+inst.get('Name')+' is '+currentValue;
            insight_details = '<ul><li>The new minumum value is: '+currentValue+'</li>'+
                'The old minumum value was: '+lastMinValue+'</li>';
            min = currentValue;
        } else {
            min = lastMinValue;
        }
        
        // repack the JSON
        fieldParams.put('stats', stats);
        
        //System.debug(JSON.serialize(fieldParams));
        instanceLedgerBot.Last_Result__c = JSON.serialize(fieldParams);
        instanceLedgerBot.Last_Result_Time__c = system.now();
        
        if (create_insight) {
            Insight__c new_insight = DataBot.createInsight(insight_name, 'Currency Bot', '', insight_details );
            
            String vals = '';
            for (Integer i = valList.size()-1; i >= 0 ; i--) {
                Double value = Double.valueOf(valList[i]);
              //  System.debug(inst.get('Name')+' || min: '+min+' max: '+max+' value: '+value);
                if (max-min != 0) {
                    value = ((value - min)/(max-min))*100;
                }
                vals += value.format();
                if (i > 0) {
                    vals += ',';
                }
                
            }
            
            String chart_opts = 'https://chart.googleapis.com/chart?cht=lc&chco=0849A2&chs=600x300&chd=t:'+
                vals+'&chxt=x,y&chxl=0:|Prev|Today|1:||'+min.format()+'||'+max.format();
            
            //System.debug(chart_opts);
            
            //generateChart(new_insight, chart_opts);
            AsyncChart ac = new AsyncChart();
            ac.insight = new_insight;
            ac.chart_options = chart_opts;
            System.enqueueJob(ac);
            
            InsightAssociation__c assoc = new InsightAssociation__c (
                Insight__c = new_insight.Id,
                RecordID__c = inst.Id,
                Name = inst.get('Name')+' + '+objField
            );
            assocs.add(assoc);            
            
        }
        
    }
    
    
    // aggeregate level comparisons
    // Insights create a whisker chart
    private void compareFieldStats (String objectName,
                                    String fieldName,
                                    String objField ) 
    {
                                        
        // get Ledger for the field 
        LedgerBot__c fieldLedgerBot = ledgers.getLedgerBotByName(objField);
        String lastResultString = fieldLedgerBot.Last_Result__c;
        Map <String, Object> fieldParams = DataBot.mapFromJSON(lastResultString);
        
        List <Object> statsList = (List <Object>)fieldParams.get('stats');
     
        
        String statQueryString = 'SELECT MIN('+objField+'), MAX('+objField+'), AVG('+objField+') FROM '+objectName;
        //System.debug(statQueryString);
        List <AggregateResult> objAggList = Database.query(statQueryString);
        
        Map <String, Object> newStats = new Map <String, Object> ();
        AggregateResult objAgg = objAggList[0];
        newStats.put('date', system.now().formatGMT('EEE, MMM d yyyy HH:mm:ss'));
        Double min = (Double)objAgg.get('expr0');
        Double max = (Double)objAgg.get('expr1');
        Double avg = (Double)objAgg.get('expr2');

        newStats.put('min', min);
        newStats.put('max', max);
        newStats.put('avg', avg);
        statsList = Util.push(statsList, newStats);
        
        // repack the JSON
        fieldParams.put('stats', statsList);
        //System.debug(JSON.serialize(fieldParams));
        fieldLedgerBot.Last_Result__c = JSON.serialize(fieldParams);
        fieldLedgerBot.Last_Result_Time__c = system.now();
        //upsert fieldLedgerBot;

        if (TRUE) {
            
            //System.debug('RAWR IT BE A STAT INSIGHT   '+objField );
            
            
            String insight_details = '<ul><li>min: '+ min.format() + '</li><li>max: '+max.format()+ '</li><li>avg: '+avg.format()+ '</li></ul>';
            Insight__c new_insight = DataBot.createInsight('Current report on stats for: '+objField, 'Stats Bot', '', insight_details);

            String mins = '';
            String maxs = '';
            String avgs = '';
            
            min = 0;
            for (Integer i = statsList.size()-1; i >= 0 ; i--) {
                Map <String, Object> statEntry = (Map <String, Object>) statsList[i];
                Double minE = Double.valueOf(statEntry.get('min'));
                Double maxE = Double.valueOf(statEntry.get('max'));
                Double avgE = Double.valueOf(statEntry.get('avg'));

                 if (max-min != 0) {
                     minE = ((minE - min)/(max-min))*100;
                     maxE = ((maxE - min)/(max-min))*100;
                     avgE = ((avgE - min)/(max-min))*100;
                }
                
                mins += minE.format();
                maxs += maxE.format();
                avgs += avgE.format();
                if (i > 0) {
                    mins += ',';
                    maxs += ',';
                    avgs += ',';
                }
            }
           
            
            String chart_opts = 
                'https://chart.googleapis.com/chart?chs=600x300&&chco=0849A2&cht=lc&chd=t0:-1,'+mins+',-1|-1,'+avgs+',-1|-1,'+avgs+',-1|-1,'+maxs+',-1'+
                '&chm=F,0000FF,0,,20&chxt=y&chxl=0:|0|'+max.format();
            
            //System.debug(chart_opts);
            
            //generateChart(new_insight, chart_opts);
            AsyncChart ac = new AsyncChart();
            ac.insight = new_insight;
            ac.chart_options = chart_opts;
            //System.enqueueJob(ac);
        }
        
    }
    
    private Map <String, Object> compare(Map <String, Object> currentParams,
                                         DescribeSObjectResult describe,
                                         String objField,
                                         String objectName,
                                         String fieldName,
                                         String idKeyName, 
                                         String valueKeyName, 
                                         List <SObject> objs )
    {
        if (objs.size() == 0) {
           // System.debug('No objects returned for Currency:'+'objField'+':'+objField);
            return currentParams;
        }
            
        SObject currentObject = objs.get(0);
        
        String currentMaxId = (String)currentObject.Id;
        Double currentMaxValue = Double.valueOf(currentObject.get(fieldName));
        
        String lastMaxId = '';
        Double lastMaxValue = 0;
        if (currentParams.containsKey(valueKeyName) && currentParams.containsKey(idKeyName) ) {
            lastMaxId = (String)currentParams.get(idKeyName);
            lastMaxValue = Double.valueOf(currentParams.get(valueKeyName));
          //  System.debug('OLD VALUE ON ID: '+lastMaxId+' VALUE: '+lastMaxValue);
        } 
        //System.debug('COMPARE ID: '+lastMaxId+' LAST VALUE: '+lastMaxValue + ' CURRENT: '+currentMaxValue);

        
        if (currentMaxValue > lastMaxValue) {
           // System.debug('NEW MAX VALUE FOUND FOR: '+objField+ 'ID= '+currentMaxId+' MAX: '+currentMaxValue);
            String insight_name = 'New max value of $'+currentMaxValue.format()+' for '+describe.getLabel()+':'+fieldName+' across all '+describe.getLabelPlural()+'.';
            String details = '<ul><li>The old max value was: $'+ lastMaxValue.format()+'<li>';
            Insight__c new_insight = DataBot.createInsight(insight_name, 'Currency Bot', '', details );
           // System.debug('NEW INSIGHT CREATED WITH ID: '+new_insight.Id);

            Double min = Math.min(lastMaxValue, currentMaxValue);
            Double max = Math.max(lastMaxValue, currentMaxValue);
            
            Double chart_last = ((lastMaxValue - min)/(max-min))*100;
            Double chart_current = ((currentMaxValue - min)/(max-min))*100;
            
             String chart_opts = 'https://chart.googleapis.com/chart?cht=lc&chco=0849A2&chs=600x300&chd=t:'+chart_last+','+chart_current+'&chxt=x,y&chxl=0:|June|Today|1:||'+lastMaxValue.format()+'||'+currentMaxValue.format();
            
          //  String chart_opts = 'https://chart.googleapis.com/chart?cht=lc&chs=200x125&chd=t:'+chart_last+','+chart_current;
            //generateChart(new_insight, chart_opts);
            AsyncChart ac = new AsyncChart();
            ac.insight = new_insight;
            ac.chart_options = chart_opts;
            System.enqueueJob(ac);

            
            currentParams.put(idKeyName, currentMaxId);
            currentParams.put(valueKeyName, currentMaxValue);            
        } else {
           // System.debug('LESS THAN ID: '+lastMaxId+' LAST VALUE: '+lastMaxValue + ' CURRENT: '+currentMaxValue);
        }
        return currentParams;
    }
    
        
}
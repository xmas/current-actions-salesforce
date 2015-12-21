public class DataSim {
    
    public DataSim () {
        
        // get all the SObjectTypes that have at least one Schema.DisplayType.Currency
        List <DataBotObjectFieldTuple> matchingTypes = DataBot.getTuplesForType(Schema.DisplayType.Currency);
        List <DataBotObjectFieldTuple> simmedFields = new List<DataBotObjectFieldTuple> ();

        for (DataBotObjectFieldTuple tuple : matchingTypes) {
            if (tuple.objType.getDescribe().getName() == 'Account' 
                && tuple.field.getDescribe().getName() == 'AnnualRevenue') {
                simmedFields.add(tuple);
            }
           /* if (tuple.objType.getDescribe().getName() == 'Lead' 
                && tuple.field.getDescribe().getName() == 'AnnualRevenue') {
                simmedFields.add(tuple);
            }
            if (tuple.objType.getDescribe().getName() == 'Opportunity' 
                && tuple.field.getDescribe().getName() == 'Amount') {
                simmedFields.add(tuple);
            }*/
        }
        
        for (DataBotObjectFieldTuple tuple : simmedFields) {
            
            String objectName = tuple.objType.getDescribe().getName();
            String fieldName = tuple.field.getDescribe().getName();
            String objField = objectName + '.' + fieldName;
            
            System.debug(objectName + '.'+fieldName);
            
            // for some reason this field gets messed up
            if (objField == 'DatacloudCompany.AnnualRevenue') {
                continue;
            }
            
            String queryString = 'SELECT '+objectName + '.Id, '+ objField + 
                ' FROM '+ objectName + ' WHERE '+ objField + ' > 0 ORDER BY '+ objField + ' DESC';
            
            List <SObject> objs = Database.query(queryString);
            // Currency:Object_Field:Instance:MAX_VALUE
            for (SObject currentObject : objs) {

                Double currencyValue = Double.valueOf(currentObject.get(fieldName));
                if (currencyValue == 0) {
                    currencyValue = MathUtil.getRandomInt(300,5000);
                }
                if (Math.random() < .3) {
                    // minus
	                currencyValue -= MathUtil.getRandomInt(100,400);
                    if (currencyValue < 1000) {
                        currencyValue = 10000;
                    }
                } else {
                    // plus
                    currencyValue +=  MathUtil.getRandomInt(5000,7000);
                }
                currentObject.put(fieldName, currencyValue);
            }
            upsert objs;
                
        }
    }
    
   
    
}
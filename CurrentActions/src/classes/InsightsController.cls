public virtual with sharing class InsightsController {


	public static String typeNameForID (String assoc_string) {

		Id assoc_id = Id.valueOf(assoc_string);
		Schema.SObjectType token = assoc_id.getSObjectType();
		Schema.DescribeSObjectResult dr = token.getDescribe();
		return dr.getLabelPlural();
	}

	static String insightQueryString = 'SELECT Id, Name, Long_Name__c, Data_Source__c, Details__c, LastModifiedDate, Assigned_User__c, OwnerId, Chart__c, Parents__c, Table_Data__c, ReportID__c, Report_Type_Label__c, Path__c, SObject_Count__c, Is_Read__c, Today_New__c, Today_Changed__c, Today_Total__c, Today_Deleted__c, History_New__c, History_Changed__c, History_Deleted__c, History_Total__c,History_Labels__c, AssocID__c, Assoc2ID__c, Assoc3ID__c, AssocLabel__c, AssocLabel2__c, AssocLabel3__c, Today_Updated__c, Summary__c, Detail_Name__c, Child_Label__c, Field_Labels__c, Outcome__c, Parent_Label__c, Value_Label__c, Parent_Type__c, Child_Type__c FROM Insight__c';

	static String newOrChangedQueryWhereString = '(Today_Updated__c > 0)';

	@AuraEnabled
	public static List <Insight__c> getInsight (Id recordID) {
		String query = insightQueryString + ' WHERE Id = \''+recordID+'\'';
		return Database.query(query);
	}

	@AuraEnabled
	public static List<Insight__c> getInsightsForSourceAndField(String source, String field) {
		String query = insightQueryString + ' WHERE (Data_Source__c = \''+source+'\' AND Field_Labels__c = \''+field+'\')';
	return Database.query(query);
	}

	@AuraEnabled
	public static List<Insight__c> getInsights() {

		Id user_id = UserInfo.getUserId();
		String query = insightQueryString + ' WHERE '+newOrChangedQueryWhereString+' AND (Type__c != null) ORDER BY CreatedDate DESC LIMIT 8';
			//+' AND (AssocID__c = \''+user_id+'\' OR Assoc2ID__c = \''+user_id+'\' OR Assoc3ID__c = \''+user_id+'\') ORDER BY CreatedDate DESC';
			return Database.query(query);
	}

	@AuraEnabled
	public static Integer getFeedItemCountForObject(String object_id) {

		List <FeedItem> items = [SELECT Id, createdDate FROM FeedItem WHERE ParentId =:object_id];
		return items.size();
	// SELECT  ParentId,  Id, createdDate FROM FeedItem WHERE (ParentId IN ('a0E61000002N2oWEAS' , 'a0E61000002N2oXEAS')) and  GROUP BY ParentId

		//
	}

	@AuraEnabled
	public static String getInsightCounts () {

		return InsightData.getInsightCounts();
	}

	@AuraEnabled
	public static Integer getMaxUpdateCount () {

		List <Insight__c> max = [SELECT Today_Updated__c FROM Insight__c WHERE Today_Updated__c > 0 ORDER BY Today_Updated__c DESC LIMIT 1];
		return Integer.valueOf(max[0].Today_Updated__c);

	}

	@AuraEnabled
	public static List<Insight__c> getInsightsWithAssociation(String assoc_id) {

		Id user_id = UserInfo.getUserId();

		String query = insightQueryString + ' WHERE (AssocID__c = \''+assoc_id+'\' OR Assoc2ID__c = \''+assoc_id+'\' OR Assoc3ID__c = \''+assoc_id+'\') AND (AssocID__c = \''+user_id+'\' OR Assoc2ID__c = \''+user_id+'\' OR Assoc3ID__c = \''+user_id+'\') ORDER BY CreatedDate DESC LIMIT 25';

		return Database.query(query);

	}

	@AuraEnabled
	public static List<Insight__c> getInsightsForSource(String source) {
		//Id user_id = UserInfo.getUserId();
		//String id_match = ' (AssocID__c = \''+user_id+'\' OR Assoc2ID__c = \''+user_id+'\' OR Assoc3ID__c = \''+user_id+'\') ';
		String query = insightQueryString + ' WHERE (Data_Source__c = \''+source+'\') ORDER BY CreatedDate DESC';
		return Database.query(query);
	}

	@AuraEnabled
	public static List<Insight__c> getInsightsByReport(Id report_id) {
		Id user_id = UserInfo.getUserId();
		String id_match = ' (AssocID__c = \''+user_id+'\' OR Assoc2ID__c = \''+user_id+'\' OR Assoc3ID__c = \''+user_id+'\') ';
		String query = insightQueryString + ' WHERE '+id_match+' AND (ReportID__c = \''+report_id+'\') ORDER BY CreatedDate DESC LIMIT 25';
		return Database.query(query);
	}

	@AuraEnabled
	public static List<Insight__c> getInsightsForTypeLabel (String labelID) {
		Id user_id = UserInfo.getUserId();
		String id_match = ' (AssocID__c = \''+user_id+'\' OR Assoc2ID__c = \''+user_id+'\' OR Assoc3ID__c = \''+user_id+'\') ';
		String query = insightQueryString + ' WHERE '+id_match+' AND (Report_Type_Label__c = \''+labelID+'\') ORDER BY CreatedDate DESC LIMIT 25';
		System.debug(query);
		return Database.query(query);

	}

	@AuraEnabled
	public static Boolean setInsightReadStatus (Id insight_id, Boolean status) {
		Insight__c insight = [SELECT Id, Name, Is_Read__c FROM Insight__c WHERE Id =:insight_id];
		insight.Is_Read__c = status;
		update insight;
		return insight.Is_Read__c;
	}

	@AuraEnabled
	public static String getUserName() {
		return UserInfo.getUserName();
	}

	@AuraEnabled
	public static String getFromS3 (String path, String file) {


		CurrentActionsAdmin__c admin = [SELECT AWS_accessKeyId__c, AWS_secretAccessKey__c, AWS_region__c FROM CurrentActionsAdmin__c WHERE Active__c = TRUE][0];

		String formattedDateString = Datetime.now().format('EEE, dd MMM yyyy HH:mm:ss z','America/Denver');
		String filename = path+'/'+file;
		//String bucketname = UserInfo.getOrganizationId().toLowerCase();

		 //String filename = '00O61000003tHIaEAM/Other/005610000012IXIAA2/store.json';
		 String bucketname = '00d61000000adm6eai';

		 System.debug(path);
		//00O61000003tGYdEAM/005610000012IXIAA2/Other
		//00O61000003tHimEAE/Agriculture/005610000012IXIAA2

		HttpRequest req = new HttpRequest();
		String region = admin.AWS_region__c;
		String contentType = 'application/json';
		String method = 'GET';

		String key = admin.AWS_accessKeyId__c;
		String secret = admin.AWS_secretAccessKey__c;

		req.setHeader('Content-Type', contentType);
		req.setMethod(method);
		req.setHeader('Host','s3-' + region + '.amazonaws.com');
		req.setEndpoint('https://s3-' + region + '.amazonaws.com' + '/'+ bucketname + '/' + filename);
		req.setHeader('Date', formattedDateString);
		req.setHeader('Authorization',createAuthHeader(method,contentType,filename,formattedDateString,bucketname,key,secret));


		Http http = new Http();
		HTTPResponse res = http.send(req);

		String body = String.ValueOF(res.getBody());
		System.debug('*Resp:' + body);
		System.debug('RESPONSE STRING: ' + res.toString());
		System.debug('RESPONSE STATUS: ' + res.getStatus());
		System.debug('STATUS_CODE: ' + res.getStatusCode());


		//List <Object> objects = (List <Object> )JSON.deserializeUntyped(body);
		//List <Id> accounts = new List <Id> ();
		//for (Object obj : objects) {
		//  Id acc = (Id)obj;
		//  accounts.add(acc);
		//}
		//return [SELECT Id, Name FROM Account WHERE Id IN :accounts];

		//return res.toString();

		return body;
	}


////method to use the S3 webservice and save pdf file
//public void saveToS3(String binaryPDF,String docName,String bucketname,String method,String contentType,String region,String key,String secret){
//        /*  Input Variable Explanations
//        binaryPDF -- this is a base64 Encoded binary string representation of a PDF I get from a different web service
//        docName --  any name you want to use as the saved document name
//        bucketname --  the Amazon S3 bucket you are saving to
//        method --  I currently only use PUT
//        contentType --  I leave this blank and it seems to work fine
//        region --  !!!Important, this needs to be the region that the S3 bucket is set to, for example '-us-west-2'
//        key --  this is the key you generate in the AWS console under Identity & Access Management for the user account setup to access the S3 bucket
//        secret --  this is the secret you generate during the same process
//        */

//        //setup variables
//        String formattedDateString = Datetime.now().format('EEE, dd MMM yyyy HH:mm:ss z','America/Denver');    //this is needed for the PUT operation and the generation of the signature.  I use my local time zone.
//        String filename;
//        HttpRequest req = new HttpRequest();
//        Http http = new Http();
//        filename = 'TEST_BUCKET_FOLDER_1/TEST_SUBFOLDER_1/' +    //Include any folders and subfolders you are using in your S3 Bucket
//            docName.replace(' ', '+') + '.pdf';   //this replaces any spaces in the desired document name with a Plus symbol '+', as the filename needs to be URL friendly

//            req.setHeader('Content-Type', contentType);
//            req.setMethod(method);
//        req.setHeader('Host','s3' + region + '.amazonaws.com');  //path style
//        req.setEndpoint('https://s3' + region + '.amazonaws.com' + '/'+ bucketname + '/' + filename);   //path style
//        req.setHeader('Date', formattedDateString);
//        req.setHeader('Authorization',createAuthHeader(method,contentType,filename,formattedDateString,bucketname,key,secret));

//        if(binaryPDF != null && binaryPDF != ''){
//          Blob pdfBlob = EncodingUtil.base64Decode(binaryPDF);
//          req.setBodyAsBlob(pdfBlob);
//          req.setHeader('Content-Length', string.valueOf(binaryPDF.length()));

//            //Execute web service call
//            try {
//              HTTPResponse res = http.send(req);
//              System.debug('MYDEBUG: ' + docName + ' RESPONSE STRING: ' + res.toString());
//              System.debug('MYDEBUG: ' + docName + ' RESPONSE STATUS: '+res.getStatus());
//              System.debug('MYDEBUG: ' + docName + ' STATUS_CODE:'+res.getStatusCode());

//              } catch(System.CalloutException e) {
//                system.debug('MYDEBUG: AWS Service Callout Exception on ' + docName + 'ERROR: ' + e.getMessage());
//              }
//            }
//          }

		//create authorization header for Amazon S3 REST API
		public static String createAuthHeader(String method,String contentType,String filename,String formattedDateString,String bucket,String key,String secret){
			string auth;
			String stringToSign = method+'\n\n'+contentType+'\n'+formattedDateString+'\n/'+bucket+'/'+filename;
			Blob mac = Crypto.generateMac('HMACSHA1', blob.valueof(stringToSign),blob.valueof(secret));
			String sig = EncodingUtil.base64Encode(mac);
			auth = 'AWS' + ' ' + key + ':' + sig;
			return auth;
		}
	}
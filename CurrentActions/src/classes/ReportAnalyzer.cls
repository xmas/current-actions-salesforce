public with sharing class ReportAnalyzer {

	public ReportAnalyzer() {

		List<Report> summaryReports = ReportBot.getSummaryReports();
		List<Insight__c> insights = new List<Insight__c> ();
		List<InsightAssociation__c> assocs = new List<InsightAssociation__c> ();


		//

		for (Report r : summaryReports) {
    		//System.debug(LoggingLevel.ERROR, r.Name + ' - '+r.Id);

    		ReportBot.ReportResponse res = ReportBot.getReportResponse(r.Id);
    		List<ReportBot.FieldDef> defs = res.sumResp.reportFields;

    		for (ReportBot.SummaryReportGroup sgroup : res.sumResp.groupList) {

    			List<List<ReportBot.FieldData>> fieldDataList = sgroup.fieldDataList;
    			if (fieldDataList.size() > 0) {
					// there is data, create an insight

					String title = '';
					if (sgroup.parent != null) {
						title = '('+sgroup.parent.fieldLabel+') ';
					}
					title = title+sgroup.fieldLabel+' has '+fieldDataList.size()+' records.';				

					String detail = '<a href="https://rowan-dev-ed.my.salesforce.com//'+r.Id+'">'+r.Name+'</a><br>';

					if (sgroup.isHyperLink) {
						detail = '<a href="https://rowan-dev-ed.my.salesforce.com//'+sgroup.fieldValue+'">'+sgroup.fieldLabel+'.</a><br>';

					//
					} else {
						detail = sgroup.fieldLabel+'.<br>';
					}


					if (fieldDataList.size() > 10) { 
						List<List<ReportBot.FieldData>> smaller = new List<List<ReportBot.FieldData>>  ();
						for (Integer i = 0; i < 10; i++) {
							smaller.add(fieldDataList[i]);
						}
						fieldDataList = smaller;
					}

					String tableHTML = buildTable(defs, fieldDataList);
					detail = detail + '<br>';
					detail = detail + tableHTML;
					if (sgroup.fieldLabel == null) {
						sgroup.fieldLabel = 'Empty';
					}
					Integer nameL = Math.MIN(75, sgroup.fieldLabel.length());

					Insight__c insight = new Insight__c(
						Name = sgroup.fieldLabel.subString(0, nameL)+'...',
						Long_Name__c = title,
						Data_Source__c = r.Name,
						Details__c = detail
						);
					insight.ReportID__c = r.Id;
					insights.add(insight);
					//System.debug(LoggingLevel.ERROR, 'NEW INSGHT: '+insight);

					if (sgroup.isHyperLink) {
						
						Id sid = Id.valueOf(sgroup.fieldValue);
						Schema.SObjectType token = sid.getSObjectType();
						Schema.DescribeSObjectResult dr = token.getDescribe();
						insight.AssocTypeName__c = dr.getName();
						insight.AssocID__c = sgroup.fieldValue;
					}
				}
			}
		}

		upsert insights;
	}


	public String imageForType (String typeName) {

		if (typeName == 'Account') {

		}
		if (typeName == 'User') {

		}
		if (typeName == 'Lead') {

		}
		if (typeName == 'Oppurtunity') {
			
		}
		return null;

	}

	public static String buildTable (List<ReportBot.FieldDef> headers, List<List<ReportBot.FieldData>>rows) {

		if (headers.size() != rows[0].size()) {
			System.debug('Attempting to build table with different numbers of headers and cells');
			return null;
		}

		String html = '<div class="slds"><table class="slds-table slds-table--bordered"><thead> <tr class="slds-text-heading--label">';
		for (ReportBot.FieldDef header : headers) {

			html = html + '<th scope="col"><span class="slds-truncate">';
			html = html + header.fieldLabel;
			html = html + '</span></th>';
		}
		html = html + '  </thead><tbody>';

		for (List<ReportBot.FieldData> row : rows) {
			html = html + '<tr class="slds-hint-parent">';
			for (Integer i = 0; i < row.size(); i++) {

				html = html + '<td data-label="'+headers[i].fieldLabel+'">';
				html = html + '<span class="slds-truncate">'+row[i].fieldLabel+'</span></td>';
			}
			html = html + '</tr>';
		}
		html = html + '</tbody></table></div>';

		return html;
	}


}
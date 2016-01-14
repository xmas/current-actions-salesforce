public with sharing class ReportBot {


	public ReportBot() {
		
		List<Report> summaryReports = getSummaryReports();

		for (Report r : summaryReports) {
			System.debug(LoggingLevel.ERROR, '-------------------------------');
			System.debug(LoggingLevel.ERROR, r.Id);

			ReportResponse resp = getReportResponse(r.id);
			for (ReportBot.SummaryReportGroup sgroup : resp.sumResp.groupList) {
				System.debug(LoggingLevel.ERROR, '---------');
				System.debug(LoggingLevel.ERROR, sgroup);
				System.debug(LoggingLevel.ERROR, sgroup.fieldDataList);

				List<List<ReportBot.FieldData>> fieldDataList = sgroup.fieldDataList;
				for (List<ReportBot.FieldData> row : fieldDataList) {
					System.debug(LoggingLevel.ERROR, row);
				}
			}
		}
	}



	public void runSummaryReports(List <Report> reportList) {
		for (Report report : reportList ) {

			if (report.Id != '00O61000002qafREAQ') {
				continue;
			}

			System.debug(report.Id);

			Reports.ReportResults reportResult = Reports.ReportManager.runReport(report.Id, true);			
			Reports.ReportMetadata metadata = reportResult.getReportMetadata();
			Reports.ReportExtendedMetadata extendedMetadata = reportResult.getReportExtendedMetadata();

			Map <String,Reports.DetailColumn> detailColumnInfo = extendedMetadata.getDetailColumnInfo();
			//Reports.ReportFactWithDetails factWithDetails = (Reports.ReportFactWithDetails) reportResult.getFactMap().get('T!T');


			for (String colName : metadata.getDetailColumns()) {
				System.debug('Column: '+detailColumnInfo.get(colName));
			}

			System.debug(extendedMetadata);

			System.debug('Aggregates'+metadata.getAggregates());
			System.debug('Division'+metadata.getDivision());
			System.debug('getGroupingsAcross()'+metadata.getGroupingsAcross());
			System.debug('getGroupingsDown()'+metadata.getGroupingsDown());




			System.debug(reportResult.getAllData());
			
			//for (String colName : metadata.getDetailColumns()) {
			//	System.debug('Column: '+detailColumnInfo.get(colName));
			//}
			
			//for (Reports.ReportDetailRow row : factWithDetails.getRows()) {
			//	for (Reports.ReportDataCell cell : row.getDataCells()) {
			//		System.debug('The cell data: ' + cell.getLabel());
			//	}
			//}  


		}
	}

	public void runTabularReports(List <Report> reportList) {

		for (Report report : reportList ) {

			Reports.ReportResults reportResult = Reports.ReportManager.runReport(report.Id, true);			
			Reports.ReportMetadata metadata = reportResult.getReportMetadata();
			Reports.ReportExtendedMetadata extendedMetadata = reportResult.getReportExtendedMetadata();

			Map <String,Reports.DetailColumn> detailColumnInfo = extendedMetadata.getDetailColumnInfo();
			Reports.ReportFactWithDetails factWithDetails = (Reports.ReportFactWithDetails) reportResult.getFactMap().get('T!T');

			
			for (String colName : metadata.getDetailColumns()) {
				System.debug('Column: '+detailColumnInfo.get(colName));
			}
			
			for (Reports.ReportDetailRow row : factWithDetails.getRows()) {
				for (Reports.ReportDataCell cell : row.getDataCells()) {
					System.debug('The cell data: ' + cell.getLabel());
				}
			}  



		}
	}

	public static ReportResponse getReportResponse(Id reportId) {
		//get the report result
		Reports.ReportResults results = Reports.ReportManager.runReport(reportId, true);

		//get the metadata
		Reports.ReportMetadata reportMetadata = results.getReportMetadata();

		//find out what type of report it is by looking at the groupings down and groupings across
		Integer groupingsDown = 0;
		Integer groupingsAcross = 0;

		List<Reports.GroupingInfo> groupingDownList = reportMetadata.getGroupingsDown();
		List<Reports.GroupingInfo> groupingAcrossList = reportMetadata.getGroupingsAcross();

		if (groupingDownList != null) {
			groupingsDown = groupingDownList.size();
		}

		if (groupingDownList != null) {
			groupingsAcross = groupingAcrossList.size();
		}		

		String reportType = 'tabular';
		if ( (groupingsDown > 0) && (groupingsAcross == 0) ) {
			reportType = 'summary';	
		}

		if ( (groupingsDown > 0) && (groupingsAcross > 0) ) {
			reportType = 'matrix';	
		}		

		reportResponse rr = new reportResponse();
		rr.reportType = reportType;	

		if (reportType == 'tabular') { 
			rr.tabResp = getTabularReportResponse(results); 
			} else if (reportType == 'summary') { 
				rr.sumResp = getSummaryReportResponse(results); 
				} else if (reportType == 'matrix') { 
					rr.tabResp = getMatrixReportResponse(results); 
				}
				return rr;
			}

			public class ReportResponse {
				public String reportType {get; set;}
				public TabularReportResponse tabResp {get; set;}
				public SummaryReportResponse sumResp {get; set;}		

				public ReportResponse(){
			// empty class
		}
	}

	public class SummaryReportResponse {
		public List<FieldDef> reportFields {get; set;}
		public List<SummaryReportGroup> groupList {get; set;}
		public SummaryReportResponse(){}
	}	

	public class SummaryReportGroup {
		public String fieldName {get; set;}
		public String fieldValue {get; set;}
		public String fieldLabel {get; set;}
		public String groupKey {get; set;}
		public Boolean isHyperLink {get; set;}	
		public Integer fieldsInGroup {get; set;}					
		public List<List<FieldData>> fieldDataList {get; set;}
		public SummaryReportGroup(){}
	}

	public class TabularReportResponse {
		public List<FieldDef> reportFields {get; set;}
		public List<List<FieldData>> fieldDataList {get; set;}
		public tabularReportResponse(){}
	}

	public class FieldDef {
		public String fieldName {get; set;}
		public String fieldLabel {get; set;}
		public String dataType {get; set;}
		public fieldDef(){}
	}

	public class FieldData {
		public String fieldValue {get; set;}
		public String fieldLabel {get; set;}
		public String dataType  {get; set;}
		public Boolean isHyperLink {get; set;}          
		public fieldData(){isHyperLink=false;}
	}

	public static TabularReportResponse getTabularReportResponse(Reports.ReportResults results) {
		TabularReportResponse trr = new TabularReportResponse();
		List<FieldDef> reportFields = new List<FieldDef> (); 
		List<List<FieldData>> fieldDataList = new List<List<FieldData>> ();  

    	//get the metadata
    	Reports.ReportMetadata reportMetadata = results.getReportMetadata();

    	//get a string array of the field names
    	List<String> fieldNames = reportMetadata.getDetailColumns();        

    	//get the extended metadata
    	Reports.ReportExtendedMetadata reportExtendedMetadata = results.getReportExtendedMetadata();

    	//get the map of the column names to their name and label
    	Map<String, Reports.DetailColumn> detailColumnMap = reportExtendedMetadata.getDetailColumnInfo();

    	//loop over the detailColumnMap and get the name, label, and data type
    	for (String fieldName: fieldNames) {
    		Reports.DetailColumn detailColumn = detailColumnMap.get(fieldName);
    		FieldDef fd = new FieldDef();
    		fd.fieldName = detailColumn.getName(); 
    		fd.fieldLabel = detailColumn.getLabel();
    		fd.dataType = detailColumn.getDataType().name();
    		reportFields.add(fd);
    	}

    	// Get the fact map from the report results
    	Reports.ReportFactWithDetails factDetails = (Reports.ReportFactWithDetails)results.getFactMap().get('T!T');     

    	List<Reports.ReportDetailRow> reportDetailRowList = factDetails.getRows();

    	//loop over the rows
    	for (Reports.ReportDetailRow reportDetailRow: reportDetailRowList) {
    		Integer cellCounter = 0;
    		List<FieldData> fieldDataRow = new List <FieldData> ();
        //loop over the cells in the row
        for (Reports.ReportDataCell reportDataCell: reportDetailRow.getDataCells()) {
        	FieldData fd = new FieldData();
        	fd.fieldValue = (String)reportDataCell.getValue();
        	fd.fieldLabel = (String)reportDataCell.getLabel();
        	fd.dataType = reportFields[cellCounter].dataType;
        	cellCounter++;
        	fieldDataRow.add(fd);
        }

        	//add the row to the list
        	fieldDataList.add(fieldDataRow);
        }

        trr.reportFields = reportFields;
        trr.fieldDataList = fieldDataList;
        return trr;
    }

    public static SummaryReportResponse getSummaryReportResponse(Reports.ReportResults results) {

    	//System.Debug(LoggingLevel.ERROR, JSON.serialize(results));

    	summaryReportResponse srr = new summaryReportResponse();
    	List<FieldDef> reportFields = new List<FieldDef> ();	

		//get the metadata
		Reports.ReportMetadata reportMetadata = results.getReportMetadata();

		//get a string array of the field names
		List<String> fieldNames = reportMetadata.getDetailColumns();		

		//get the extended metadata
		Reports.ReportExtendedMetadata reportExtendedMetadata = results.getReportExtendedMetadata();

		//get the map of the column names to their name and label
		Map<String, Reports.DetailColumn> detailColumnMap = reportExtendedMetadata.getDetailColumnInfo();

		//get the map of the grouping column names to their name and label
		Map<String, Reports.GroupingColumn> groupingColumnMap = reportExtendedMetadata.getGroupingColumnInfo();		

		//get the grouping column info
		Reports.GroupingInfo groupingInfo = reportMetadata.getGroupingsDown()[0]; //only supports one grouping level
		Reports.GroupingColumn groupingColumnDetail = groupingColumnMap.get(groupingInfo.getName());				

		//loop over the detailColumnMap and get the name, label, and data type
		for (String fieldName: fieldNames) {
			Reports.DetailColumn detailColumn = detailColumnMap.get(fieldName);
			fieldDef fd = new fieldDef();
			fd.fieldName = detailColumn.getName(); 
			fd.fieldLabel = detailColumn.getLabel();
			fd.dataType = detailColumn.getDataType().name();
			reportFields.add(fd);
		}
		srr.reportFields = reportFields;

		//get the summary grouping down dimension grouping values.  only going 1 level deep
		List<SummaryReportGroup> groupList = new List<SummaryReportGroup>();
		for (Reports.GroupingValue groupingValue: results.getGroupingsDown().getGroupings()) {

			//System.debug(LoggingLevel.ERROR, groupingValue);


			SummaryReportGroup srg = new SummaryReportGroup();
			srg.fieldName = groupingColumnDetail.getLabel();
			try {			
				srg.fieldValue = (String)groupingValue.getValue();
				} catch (Exception e) {
					srg.fieldValue = String.valueOf(groupingValue.getValue());
				}

				srg.fieldLabel = groupingValue.getLabel();
				srg.groupKey = groupingValue.getKey();
				srg.isHyperLink = isHyperlink(srg.fieldValue);

				//System.debug(LoggingLevel.ERROR, 'SRG: '+srg);


			//use our group key to get the group rows from the fact map
			Reports.ReportFactWithDetails factDetails = (Reports.ReportFactWithDetails)results.getFactMap().get(srg.groupKey+'!T');	

			//System.debug(LoggingLevel.ERROR, factDetails);


			List<Reports.ReportDetailRow> reportDetailRowList = factDetails.getRows();			

			List<List<fieldData>> fieldDataList = new List<List<fieldData>>();

			//loop over the rows
			for (Reports.ReportDetailRow reportDetailRow: reportDetailRowList) {
				//System.debug(LoggingLevel.ERROR, reportDetailRow);
				Integer cellCounter = 0;
				List<FieldData> fieldDataRow = new List<FieldData> ();

				//loop over the cells in the row
				for (Reports.ReportDataCell reportDataCell: reportDetailRow.getDataCells()) {
					FieldData fd = new FieldData();
					try {
						fd.fieldValue = (String)reportDataCell.getValue();
						fd.fieldLabel = (String)reportDataCell.getLabel();
						fd.dataType = reportFields[cellCounter].dataType;
						fd.isHyperLink = isHyperlink(fd.fieldValue);
						} catch (Exception e) {
							System.debug(reportDataCell + ' was a Datetime');
							fd.fieldValue = 'DATETIME';
							fd.fieldLabel = (String)reportDataCell.getLabel();
							fd.dataType = reportFields[cellCounter].dataType;
						}
						cellCounter++;
						//System.debug(LoggingLevel.ERROR, fd);
						fieldDataRow.add(fd);
					}

			//add the row to the list
			fieldDataList.add(fieldDataRow);
		}			
		srg.fieldsInGroup = srr.reportFields.size();			
		srg.fieldDataList = fieldDataList;
		groupList.add(srg);
	}
	srr.groupList = groupList;

	return srr;
}

public static TabularReportResponse getMatrixReportResponse(Reports.ReportResults results) {
	TabularReportResponse trr = new tabularReportResponse();
	List<fieldDef> reportFields = new List<fieldDef>();
	List<List<fieldData>> fieldDataList = new List<List<fieldData>>();		

	//get the metadata
	Reports.ReportMetadata reportMetadata = results.getReportMetadata();

	//get a string array of the field names
	List<String> fieldNames = reportMetadata.getDetailColumns();		

	//get the extended metadata
	Reports.ReportExtendedMetadata reportExtendedMetadata = results.getReportExtendedMetadata();

	//get the map of the grouping column names to their name and label
	Map<String, Reports.GroupingColumn> detailColumnMap = reportExtendedMetadata.getGroupingColumnInfo();

	//create the reportFields header row from the grouping fields

	//first add the grouping down field info
	Reports.GroupingInfo groupingInfoDown = reportMetadata.getGroupingsDown()[0]; //only supports one grouping level
	Reports.GroupingColumn groupingColumnDown = detailColumnMap.get(groupingInfoDown.getName());
	fieldDef fdGroupDown = new fieldDef();
	fdGroupDown.fieldName = groupingColumnDown.getName(); 
	fdGroupDown.fieldLabel = groupingColumnDown.getLabel();
	fdGroupDown.dataType = groupingColumnDown.getDataType().name();
	reportFields.add(fdGroupDown);

	//now add all the groupings across
	for (Reports.GroupingValue groupingValue: results.getGroupingsAcross().getGroupings()) {
		fieldDef fd = new fieldDef();
		fd.fieldName = (String)groupingValue.getValue(); 
		fd.fieldLabel = groupingValue.getLabel();
		fd.dataType = 'DOUBLE_DATA';
		reportFields.add(fd);			
	}				

	//get the matrix grouping down dimension grouping values.  only going 1 level deep
	List<summaryReportGroup> groupListDown = new List<summaryReportGroup>();
	for (Reports.GroupingValue groupingValue: results.getGroupingsDown().getGroupings()) {
		summaryReportGroup srg = new summaryReportGroup();
		srg.fieldValue = (String)groupingValue.getValue();
		srg.fieldLabel = groupingValue.getLabel();
		srg.groupKey = groupingValue.getKey();
		srg.isHyperLink = isHyperlink(srg.fieldValue);
		groupListDown.add(srg);
	}

	//get the matrix grouping across dimension grouping values.  only going 1 level deep
	List<summaryReportGroup> groupListAcross = new List<summaryReportGroup>();
	for (Reports.GroupingValue groupingValue: results.getGroupingsAcross().getGroupings()) {
		summaryReportGroup srg = new summaryReportGroup();
		srg.fieldValue = (String)groupingValue.getValue();
		srg.fieldLabel = groupingValue.getLabel();
		srg.groupKey = groupingValue.getKey();
		srg.isHyperLink = isHyperlink(srg.fieldValue);
		groupListAcross.add(srg);
	}		

	//now we need to do a nested loop of the groupings down and across to get all the data from the fact map
	for (summaryReportGroup down: groupListDown) {
		List<fieldData> fieldDataRow = new List<fieldData>();

		//first cell is the grouping down
		fieldData fd = new fieldData();
		fd.fieldValue = down.fieldValue;
		fd.fieldLabel = down.fieldLabel;
		fd.dataType = 'STRING_DATA';
		fd.isHyperLink = down.isHyperLink;
		fieldDataRow.add(fd);					

		for (summaryReportGroup across: groupListAcross) {
			//use our composite down!across key to get values from the fact map
			Reports.ReportFactWithDetails factDetails = (Reports.ReportFactWithDetails)results.getFactMap().get(down.groupKey+'!'+across.groupKey);	
			Reports.SummaryValue summaryValue = factDetails.getAggregates()[0]; //only support 1 set of aggregates

			fd = new fieldData();
			fd.fieldValue = (String)(summaryValue.getValue()+'');
			fd.fieldLabel = (String)(summaryValue.getLabel()+'');
			fd.dataType = 'DOUBLE_DATA';
			fieldDataRow.add(fd);						

		}
			//add the row to the list
			fieldDataList.add(fieldDataRow);
		}

		trr.reportFields = reportFields;
		trr.fieldDataList = fieldDataList;

		return trr;
	}

	public static Boolean isHyperlink(String sVal) {
		Boolean isHyperLink = true;
		Id theId;
		try {theId = (Id)sVal;}
		catch (Exception e) {isHyperLink = false;}
		return isHyperLink;
	}

	public List <Report> getSummaryReports() {
		return [SELECT Id, Name FROM Report WHERE Format = 'Summary' ORDER BY Name];
	}

	public List <Report> getTabularReports() {
		return [SELECT Id, Name FROM Report WHERE Format = 'Tabular' ORDER BY Name];
	}

}
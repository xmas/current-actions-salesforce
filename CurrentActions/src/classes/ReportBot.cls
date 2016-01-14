public with sharing class ReportBot {


	public ReportBot() {
		
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
				rr.sumResp = getSummaryReportResponse(reportId, results); 
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
		public String path {get; set;}
		public String fieldName {get; set;}
		public String fieldValue {get; set;}
		public String fieldLabel {get; set;}
		public String groupKey {get; set;}
		public Boolean isHyperLink {get; set;}	
		public Integer fieldsInGroup {get; set;}					
		public List<List<FieldData>> fieldDataList {get; set;}
		public List<SummaryReportGroup> groupParents {get; set;}
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

	public static SummaryReportGroup createSummaryReportGroup (
		Reports.GroupingColumn groupingColumnDetail, 
		Reports.GroupingValue groupingValue,
		String path
		) {

		SummaryReportGroup srg = new SummaryReportGroup();
		srg.fieldName = groupingColumnDetail.getLabel();
		try { srg.fieldValue = (String)groupingValue.getValue(); } catch (Exception e) { srg.fieldValue = String.valueOf(groupingValue.getValue()); }
		srg.fieldLabel = groupingValue.getLabel();
		srg.groupKey = groupingValue.getKey();
		srg.isHyperLink = isHyperlink(srg.fieldValue);
		srg.path = path+'.'+srg.fieldValue.replaceAll(' ','');
		System.debug(LoggingLevel.ERROR, 'PARENT SRG: '+srg);
		return srg;
	}

	public static SummaryReportResponse getSummaryReportResponse(Id reportId, Reports.ReportResults results) {

    	//System.Debug(LoggingLevel.ERROR, JSON.serialize(results));

    	SummaryReportResponse srr = new SummaryReportResponse();

    	Reports.ReportMetadata reportMetadata = results.getReportMetadata();
    	Reports.ReportExtendedMetadata reportExtendedMetadata = results.getReportExtendedMetadata();

    	/* Column Details */
		//get the map of the column names to their name and label
		Map<String, Reports.DetailColumn> detailColumnMap = reportExtendedMetadata.getDetailColumnInfo();

		//loop over the detailColumnMap and get the name, label, and data type
		List<FieldDef> reportFields = new List<FieldDef> ();	


		for (String fieldName: reportMetadata.getDetailColumns()) {
			Reports.DetailColumn detailColumn = detailColumnMap.get(fieldName);
			fieldDef fd = new fieldDef();
			fd.fieldName = detailColumn.getName(); 
			fd.fieldLabel = detailColumn.getLabel();
			fd.dataType = detailColumn.getDataType().name();
			reportFields.add(fd);
		}
		srr.reportFields = reportFields;


		/* Groupings */

		//get the map of the grouping column names to their name and label
		Map<String, Reports.GroupingColumn> groupingColumnMap = reportExtendedMetadata.getGroupingColumnInfo();		

		//get the grouping column info
		Reports.GroupingInfo groupingInfo = reportMetadata.getGroupingsDown()[0]; //only supports one grouping level
		Reports.GroupingColumn groupingColumnDetail = groupingColumnMap.get(groupingInfo.getName());				

		//get the summary grouping down dimension grouping values.  only going 1 level deep
		List<SummaryReportGroup> groupList = new List<SummaryReportGroup>();
		for (Reports.GroupingValue groupingValue: results.getGroupingsDown().getGroupings()) {

			SummaryReportGroup srg = createSummaryReportGroup (groupingColumnDetail, groupingValue, reportId);
			System.debug(LoggingLevel.ERROR, 'PARENT SRG: '+srg);


			List<Reports.GroupingValue> child_groupings = groupingValue.getGroupings();
			if (child_groupings.size() > 0) {
				System.debug(LoggingLevel.ERROR, String.valueOf(groupingValue.getValue())+' has '+child_groupings.size()+' child_groupings');

				for (Reports.GroupingValue childGrouping : child_groupings) {


					//get the grouping column info
					Reports.GroupingInfo childGroupingInfo = reportMetadata.getGroupingsDown()[1]; 
					Reports.GroupingColumn childGroupingColumnDetail = groupingColumnMap.get(childGroupingInfo.getName());	


					SummaryReportGroup childSRG = new SummaryReportGroup();
					childSRG.fieldName = groupingColumnDetail.getLabel();
					try { childSRG.fieldValue = (String)childGrouping.getValue(); } catch (Exception e) { childSRG.fieldValue = String.valueOf(childGrouping.getValue()); }
					childSRG.fieldLabel = childGrouping.getLabel();
					childSRG.groupKey = childGrouping.getKey();
					childSRG.isHyperLink = isHyperlink(childSRG.fieldValue);
					childSRG.path = srg.path+'.'+childSRG.fieldValue.replaceAll(' ','');
					System.debug(LoggingLevel.ERROR, '--CHILD SRG: '+childSRG);

				}
			}



			//use our group key to get the group rows from the fact map
			System.debug(LoggingLevel.ERROR, srg.groupKey);
			Reports.ReportFactWithDetails factDetails = (Reports.ReportFactWithDetails)results.getFactMap().get(srg.groupKey+'!T');	

			System.debug(LoggingLevel.ERROR, factDetails.getAggregates());


			List<Reports.ReportDetailRow> reportDetailRowList = factDetails.getRows();			

			List<List<fieldData>> fieldDataList = new List<List<fieldData>>();

			//loop over the rows
			for (Reports.ReportDetailRow reportDetailRow : reportDetailRowList) {
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

    public static Boolean isHyperlink(String sVal) {
    	Boolean isHyperLink = true;
    	Id theId;
    	try {theId = (Id)sVal;}
    	catch (Exception e) {isHyperLink = false;}
    	return isHyperLink;
    }

    public static List <Report> getSummaryReports() {
    	return [SELECT Id, Name FROM Report WHERE Format = 'Summary' ORDER BY Name];
    }

    public List <Report> getTabularReports() {
    	return [SELECT Id, Name FROM Report WHERE Format = 'Tabular' ORDER BY Name];
    }

}
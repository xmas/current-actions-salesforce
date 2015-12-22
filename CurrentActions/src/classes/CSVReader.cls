public class CSVReader {
	public boolean EOF {
		get
		{
			if( this.position < this.csvStringLength )
				return false;
			else
				return true;
		}
	}
		   
	private string csvString;
	private integer csvStringLength;
	private integer position = 0;
	
	private static string COMMA = ',';
	private static string NL = '\n';
	private static string QUOTE = '"';
	private static string DOUBLE_QUOTE = '""';

	public CSVReader( string csvString )
	{
		this.csvString = csvString;
		this.csvStringLength = csvString.length();
	}
	
	private integer ReadToLine(integer position, List<string> values)
	{
		integer startPos = position;

		string currentValue;
		integer cAt, nlAt, foundAt;

		List<string> tmpValues = new List<string>();
		while (position < csvStringLength)
		{
			cAt = this.csvString.indexOf( COMMA, position );
			nlAt = this.csvString.indexOf( NL, position );
			foundAt = Math.min( cAt, nlAt );
			if( foundAt == -1 )
					foundAt = Math.max( cAt, nlAt );


			if (foundAt == -1)
			{
				currentValue = this.csvString.substring(startPos);
				position = this.csvStringLength;
			}
			else
			{
				currentValue = this.csvString.substring(startPos, foundAt );
				position = foundAt + 1;
			}


			if( !currentValue.startsWith( QUOTE ) )
			{
				tmpValues.add( currentValue );

				if( foundAt == nlAt )
					break;

				startPos = position;
			}
			else if( currentValue.endsWith( QUOTE ) && !currentValue.endsWith( DOUBLE_QUOTE ) )
			{
				if( currentValue.indexOf( DOUBLE_QUOTE ) == -1 )
					tmpValues.add( currentValue.substring( 1, currentValue.length() - 1 ) );
				else
					tmpValues.add( currentValue.substring( 1, currentValue.length() - 1 ).replace( DOUBLE_QUOTE, QUOTE ) );
					
				if( foundAt == nlAt )
					break;
				
				startPos = position;
			}
		}

		values.addAll( tmpValues );
		return position;
	}

	public List<string> ReadLine()
	{
		List<string> values = new List<string>();
		this.position = this.ReadToLine( this.position, values );
		return values;
	}

	public static List<List<string>> Parse( string csvString )
	{
		List<List<string>> linesValues = new List<List<string>>();

		CSVReader reader = new CSVReader(csvString);
		while (!reader.EOF)
		{
			List<string> actualValues = reader.ReadLine();
			linesValues.Add(actualValues);
		}

		return linesValues;
	}

public static List<List<String>> parseCSV(String contents,Boolean skipHeaders) {
	List<List<String>> allFields = new List<List<String>>();

	// replace instances where a double quote begins a field containing a comma
	// in this case you get a double quote followed by a doubled double quote
	// do this for beginning and end of a field
	contents = contents.replaceAll(',"""',',"DBLQT').replaceall('""",','DBLQT",');
	// now replace all remaining double quotes - we do this so that we can reconstruct
	// fields with commas inside assuming they begin and end with a double quote
	contents = contents.replaceAll('""','DBLQT');
	// we are not attempting to handle fields with a newline inside of them
	// so, split on newline to get the spreadsheet rows
	List<String> lines = new List<String>();
	try {
		lines = contents.split('\n');
	} catch (System.ListException e) {
		System.debug('Limits exceeded?' + e.getMessage());
	}
	Integer num = 0;
	for(String line : lines) {
		System.debug('line parse:'+line);
		// check for blank CSV lines (only commas)
		if (line.replaceAll(',','').trim().length() == 0) break;
		
		List<String> fields = line.split(',');	
		List<String> cleanFields = new List<String>();
		String compositeField;
		Boolean makeCompositeField = false;
		for(String field : fields) {
			System.debug('parse field'+field);
			if (field.startsWith('"') && field.endsWith('"')) {
				cleanFields.add(field.replaceAll('DBLQT','"'));
			} else if (field.startsWith('"')) {
				makeCompositeField = true;
				compositeField = field;
			} else if (field.endsWith('"')) {
				compositeField += ',' + field;
				cleanFields.add(compositeField.replaceAll('DBLQT','"'));
				makeCompositeField = false;
			} else if (makeCompositeField) {
				compositeField +=  ',' + field;
			} else {
				cleanFields.add(field.replaceAll('DBLQT','"'));
			}
		}
		
		allFields.add(cleanFields);
	}
	if (skipHeaders) allFields.remove(0);
	return allFields;		
}


}
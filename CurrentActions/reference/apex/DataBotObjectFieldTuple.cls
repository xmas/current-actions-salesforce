public with sharing class DataBotObjectFieldTuple {

	public Schema.SObjectType objType;
	public Schema.SObjectField field;

	public DataBotObjectFieldTuple(Schema.SObjectType objType, Schema.SObjectField field) {
		this.objType = objType;
		this.field = field;
	}
}
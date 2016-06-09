public class MyConsoleController {

	public Case selectedCase { get; set; }
	
	public Solution[] getSolutions() {
		return [SELECT Id, SolutionNumber, SolutionName, Status FROM Solution];
	}
	
	public Case[] getMyCases() {
		return [SELECT Id, Subject, Status FROM Case WHERE OwnerId = :UserInfo.getUserId()
			AND Status != 'Closed'];
	}
	
	public PageReference viewCase() {
		String caseId = ApexPages.currentPage().getParameters().get('caseId');
		selectedCase = [SELECT Id FROM Case WHERE Id = :caseId];
		return null;
	}
	
	public PageReference viewSolution() {
		String solId = ApexPages.currentPage().getParameters().get('solId');
		return new PageReference('/' + solId);
	}
}
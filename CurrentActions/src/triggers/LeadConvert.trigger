trigger LeadConvert on Lead (before update) {
   LeadStatus convertStatus = [
   select MasterLabel
   from LeadStatus
   where IsConverted = true
   limit 1
   ];
   List<Database.LeadConvert> leadConverts = new List<Database.LeadConvert>();

   for (Lead lead: Trigger.new) {
      if (!lead.isConverted && lead.HasOptedOutOfFax == true) {
         Database.LeadConvert lc = new Database.LeadConvert();
         String oppName = lead.Name;

         lc.setLeadId(lead.Id);
         lc.setOpportunityName(oppName);
         lc.setConvertedStatus(convertStatus.MasterLabel);

         leadConverts.add(lc);
     }
 }

 if (!leadConverts.isEmpty()) {
  List<Database.LeadConvertResult> lcr = Database.convertLead(leadConverts);
}
}


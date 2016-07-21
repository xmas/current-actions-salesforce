public with sharing class InsightData {


    public static String getInsightCounts () {

       List <AggregateResult> global_results = [SELECT SUM(Today_Total__c), SUM(Today_New__c), SUM(Today_Changed__c) FROM Insight__c ];

       Id user_id = UserInfo.getUserId();
       List <AggregateResult> user_results = [SELECT SUM(Today_Total__c), SUM(Today_New__c), SUM(Today_Changed__c) FROM Insight__c WHERE (AssocID__c = :user_id OR Assoc2ID__c =:user_id OR Assoc3ID__c =:user_id)];

        Map<String, Object> vals = new Map<String, Object>();

       Map<String, Integer> all_users = new Map <String, Integer>();
       all_users.put('total', Integer.valueOf(global_results[0].get('expr0')));
       all_users.put('new', Integer.valueOf(global_results[0].get('expr1')));
       all_users.put('changed', Integer.valueOf(global_results[0].get('expr2')));
       vals.put('all_users', all_users);

       Map<String, Integer> user = new Map<String, Integer>();
       user.put('total', Integer.valueOf(user_results[0].get('expr0')));
       user.put('new', Integer.valueOf(user_results[0].get('expr1')));
       user.put('changed', Integer.valueOf(user_results[0].get('expr2')));
       vals.put('user', user);

       return JSON.serialize(vals);
    
   }
   

  // public static List <Object> getTopics () {
  //  return [SELECT Topic.Name, Topic.TalkingAbout, EntityId FROM TopicAssignment WHERE EntityType = 'Insight__c'];
  //}

}
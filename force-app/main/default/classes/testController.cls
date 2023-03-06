public with sharing class testController {
    @AuraEnabled(cacheable=true)
    public static List<ProfileSkill__x> getSkillsForUser(Id userId) {
        try {
            User servicesUser = [
                SELECT Org62Id__c
                FROM User
                WHERE Id = :userId
                LIMIT 1
            ];

            List<String> skillIdsByUser = new List<String>();
            for (ProfileSkillUser__x psu : [
                SELECT ProfileSkillId__c 
                FROM ProfileSkillUser__x 
                WHERE UserId__c = :servicesUser.Org62Id__c
                ]
            ) {
                skillIdsByUser.add(psu.ProfileSkillId__c);
            }

            List<ProfileSkill__x> skillsByUser = [
                SELECT Name__c, Category_c__c, Type_c__c
                FROM ProfileSkill__x
                WHERE Id IN :skillIdsByUser
            ];

            return skillsByUser;

        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}

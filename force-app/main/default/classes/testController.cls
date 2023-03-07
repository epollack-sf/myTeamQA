public with sharing class testController {
    @AuraEnabled(cacheable=true)
    public static List<SkillDataWrapper> getSkillsForUser(Id userId) {
        try {
            User servicesUser = [
                SELECT Org62Id__c
                FROM User
                WHERE Id = :userId
                LIMIT 1
            ];

            List<ProfileSkillUserTax__x> userSkills = [
                SELECT ProfileSkillId__r.Name__c, ProfileSkillId__r.Category_c__c, ProfileSkillId__r.Type_c__c, Expertise_Rating_c__c
                FROM ProfileSkillUserTax__x
                WHERE UserId__c = :servicesUser.Org62Id__c
            ];

            List<SkillDataWrapper> skillsByUser = new List<SkillDataWrapper>();
            for (ProfileSkillUserTax__x userSkill : userSkills) { // ProfileSkillUserTax__x is needed to get expertise rating
                skillsByUser.add(new SkillDataWrapper(userSkill)); // reformat to meet use case
            }

            return skillsByUser;

        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    private class SkillDataWrapper {
        // What data? --> One object/skill entry (singlular) vs. one object/user with list of skill entries that have (bulkified)

        // Currently One object/skill entry

        @AuraEnabled public String SkillName {get; set;}
        @AuraEnabled public String SkillCategory {get; set;}
        @AuraEnabled public String SkillType {get; set;}
        @AuraEnabled public String SkillRating {get; set;}

        public SkillDataWrapper(ProfileSkillUserTax__x userSkill) {
            SkillName = userSkill.ProfileSkillId__r.Name__c;
            SkillCategory = userSkill.ProfileSkillId__r.Category_c__c;
            SkillType = userSkill.ProfileSkillId__r.Type_c__c;
            SkillRating = userSkill.Expertise_Rating_c__c;
        }
    }
}

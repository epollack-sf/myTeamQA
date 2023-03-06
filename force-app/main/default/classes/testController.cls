public with sharing class testController {
    @AuraEnabled(cacheable=true)
    public static List<SkillDataWrapper> getSkillsForUser(Id userId) {
        try {
            User servicesUser = [
                SELECT Name, Org62Id__c
                FROM User
                WHERE Id = :userId
                LIMIT 1
            ];

            List<SkillDataWrapper> skillsByUser = new List<SkillDataWrapper>();
            List<ProfileSkillUserTax__x> userSkills = [
                SELECT Expertise_Rating_c__c, ProfileSkillId__r.Name__c, ProfileSkillId__r.Category_c__c, ProfileSkillId__r.Type_c__c
                FROM ProfileSkillUserTax__x
                WHERE UserId__c = :servicesUser.Org62Id__c
            ];

            for (ProfileSkillUserTax__x psut : userSkills) { // ProfileSkillUserTax__x is needed to get expertise rating
                skillsByUser.add(new SkillDataWrapper(servicesUser.Name, psut)); // reformat to meet use case
            }

            return skillsByUser;

        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    private class SkillDataWrapper {
        // What data? --> One object/skill entry vs. one object/user with list of skill entries that have

        public SkillDataWrapper(String name, ProfileSkillUserTax__x userSkill) {
            this.name = name;
            this.userSkill = userSkill;
        }
    }
}

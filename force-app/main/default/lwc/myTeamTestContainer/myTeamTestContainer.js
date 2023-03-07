import { LightningElement, wire } from 'lwc';
import getSkillsForUser from '@salesforce/apex/testController.getSkillsForUser';

export default class MyTeamTestContainer extends LightningElement {
    
    // should be api (pulled from parent component or LMS)
    userIdServices = '0053A00000FGfNiQAL';

    // should be api (pulled from parent component or LMS)
    employee = {
        FirstName: 'Ayesha',
        LastName: 'Singh',
        get FullName() {
            return this.FirstName + this.LastName
        }
    };

    skills;

    @wire(getSkillsForUser, { userId: '$userIdServices' })
    wiredSkillData(value) {
        if (value.data) {
            this.skills = value.data;
        }

        if (value.error) {
            console.warn(value.error);
        }
    }
}
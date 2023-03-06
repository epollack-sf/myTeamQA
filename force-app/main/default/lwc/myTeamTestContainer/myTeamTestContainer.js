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
    
    /*skills = [
        {
            id: '1',
            Type__c: 'Type',
            Category__c: 'Bowling',
            Rating__c: 4
        },
        {
            id: '1',
            Type__c: 'Type',
            Category__c: 'Archery',
            Rating__c: 1
        },
        {
            id: '1',
            Type__c: 'Type',
            Category__c: 'Skiing',
            Rating__c: 5
        },
        {
            id: '1',
            Type__c: 'Type',
            Category__c: 'Skiing',
            Rating__c: 2
        },
    ];*/

    skills2 = [
        {
            id: '1',
            Type__c: 'Type',
            Category__c: 'Bowling',
            Rating__c: 4
        },
        {
            id: '1',
            Type__c: 'Type',
            Category__c: 'Archery',
            Rating__c: 1
        },
        {
            id: '1',
            Type__c: 'Type',
            Category__c: 'Skiing',
            Rating__c: 5
        },
        {
            id: '1',
            Type__c: 'Type',
            Category__c: 'Skiing',
            Rating__c: 2
        },
        {
            id: '1',
            Type__c: 'Type',
            Category__c: 'Running',
            Rating__c: 4
        },
        {
            id: '1',
            Type__c: 'Type',
            Category__c: 'Snowboarding',
            Rating__c: 1
        },
        {
            id: '1',
            Type__c: 'Type',
            Category__c: 'Surfing',
            Rating__c: 5
        },
        {
            id: '1',
            Type__c: 'Type',
            Category__c: 'Hiking',
            Rating__c: 2
        },
        {
            id: '1',
            Type__c: 'Type',
            Category__c: 'Bowling',
            Rating__c: 4
        },
        {
            id: '1',
            Type__c: 'Type',
            Category__c: 'Archery',
            Rating__c: 1
        },
        {
            id: '1',
            Type__c: 'Type',
            Category__c: 'Wake Boarding',
            Rating__c: 5
        },
        {
            id: '1',
            Type__c: 'Type',
            Category__c: 'Kayaking',
            Rating__c: 2
        },
    ];

    /*employee = {
        Name: 'Evan'
    };*/

    employee2 = {
        Name: 'Claude'
    };
}
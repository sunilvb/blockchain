/*
SPDX-License-Identifier: Apache-2.0
// Enumerate charity project state values. The project move through these phases to completion
// CREATED, FUNDED, STARTED, EXECUTING, FINALIZING, COMPLETED

// Contract Rules:
- Cannot Fund untill Auditor, Beneficiary, Start and End dates defined
- Cannot start untill funded
- Cannot Execute untill 25% completed and Started funds exhausted, complete date should be within x-days of projected date, need Auditor sign-off
- Cannot Finalize untill 50% completed and Executing funds exhausted, complete date should be within y-days of projected date, need Auditor sign-off
- Cannot Complete untill 75% completed and Finalize funds exhausted, complete date should be within z-days of projected date, need Auditor sign-off
- more business rules and checks to be added....
*/

'use strict';

// Fabric smart contract classes
const { Contract, Context } = require('fabric-contract-api');

// projectNet specifc classes
const CharityProject = require('./project.js');
const ProjectList = require('./projectlist.js');

/**
 * A custom context provides easy access to list of all commercial projects
 */
class CharityProjectContext extends Context {

    constructor() {
        super();
        // All projects are held in a list of projects
        this.projectList = new ProjectList(this);
    }

}

/**
 * Define charity project smart contract by extending Fabric Contract class
 *
 */
class CharityProjectContract extends Contract {

    constructor() {
        // Unique namespace when multiple contracts per chaincode file
        super('org.charitably.charityproject');
    }

    /**
     * Define a custom context for charity project
    */
    createContext() {
        return new CharityProjectContext();
    }

    /**
     * Instantiate to perform any setup of the ledger that might be required.
     * @param {Context} ctx the transaction context
     */
    async instantiate(ctx) {
        // No implementation required with this example
        // It could be where data migration is performed, if necessary
        console.log('Instantiate the contract');
    }


    /**
     * Create Charity Project
     *
     * @param {Context} ctx the transaction context
     * @param {String} owner commercial project issuer
     * @param {Integer} projectNumber project number for this issuer
     * @param {String} startDateTime project issue date
     * @param {String} endDateTime project maturity date
     * @param {Integer} projectCost face value of project
    */
    async create(ctx, owner, projectNumber, startDateTime, endDateTime, projectCost) {

        // create an instance of the project
        let project = CharityProject.createInstance(owner, projectNumber, startDateTime, endDateTime, projectCost);

        // Smart contract, rather than project, moves project into CREATED state
        project.setCreated();

        // Newly created project is owned by the owner
        project.setOwner(owner);

        // Add the project to the list of all similar charity projects in the ledger world state
        await ctx.projectList.addProject(project);

        // Must return a serialized project to caller of smart contract
        return project;
    }

    /**
     * Start Charity Project
     *
     * @param {Context} ctx the transaction contextProject
     * @param {String} owner charity project owner
     * @param {Integer} projectNumber project number for this owner
     * @param {String} auditor current auditor of project
     * @param {String} bebeficiary new bebeficiary of project
     * @param {Integer} amount amount paid for this phase of the project
     * @param {String} actualStartDateTime time project was purchased (i.e. traded)
    */
    async start(ctx, owner, projectNumber, auditor, bebeficiary, amount, actualStartDateTime) {

        // Retrieve the current project using key fields provided
        let projectKey = CharityProject.makeKey([owner, projectNumber]);
        let project = await ctx.projectList.getProject(projectKey);



        // First buy moves state from Created to Started
        if (project.isCreated()) {
            project.setStarted();
        }

        // Add more business rules and checks

        // Update the project
        await ctx.projectList.updateProject(project);
        return project;
    }

    /**
     * Redeem commercial project
     *
     * @param {Context} ctx the transaction context
     * @param {String} issuer commercial project issuer
     * @param {Integer} projectNumber project number for this issuer
     * @param {String} redeemingOwner redeeming owner of project
     * @param {String} redeemDateTime time project was redeemed
    */
    async finish(ctx, owner, projectNumber, redeemingOwner, redeemDateTime) {

        let projectKey = CharityProject.makeKey([owner, projectNumber]);
        let project = await ctx.projectList.getProject(projectKey);



        // First buy moves state from Created to Started
        if (project.isStarted()) {
            project.setCompleted();
        }

        // Update the project
        await ctx.projectList.updateProject(project);
        return project;
    }

}

module.exports = CharityProjectContract;

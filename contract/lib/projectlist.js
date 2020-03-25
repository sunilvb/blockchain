/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Utility class for collections of ledger states --  a state list
const StateList = require('./../ledger-api/statelist.js');

const CharityProject = require('./project.js');

class PaperList extends StateList {

    constructor(ctx) {
        super(ctx, 'org.charitably.charityprojectlist');
        this.use(CharityProject);
    }

    async addProject(project) {
        return this.addState(project);
    }

    async getProject(projectKey) {
        return this.getState(projectKey);
    }

    async updateProject(project) {
        return this.updateState(project);
    }
}


module.exports = ProjectList;

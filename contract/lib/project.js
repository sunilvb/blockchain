/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Utility class for ledger state
const State = require('./../ledger-api/state.js');

// Enumerate charity project state values
// CREATED, FUNDED, STARTED, EXECUTING, FINALIZING, COMPLETED
const cpState = {
    CREATED: 1,
    FUNDED: 2,
    STARTED: 3,
    EXECUTING: 4,
    FINALIZING: 5,
    COMPLETED: 6
};

/**
 * CharityProject class extends State class
 * Class will be used by application and smart contract to define a paper
 */
class CharityProject extends State {

    constructor(obj) {
        super(CharityProject.getClass(), [obj.owner, obj.projectNumber]);
        Object.assign(this, obj);
    }

    /**
     * Basic getters and setters
    */
    getOwner() {
        return this.owner;
    }

    setOwner(newOwner) {
        this.owner = newOwner;
    }

    getOwner() {
        return this.owner;
    }

    setOwner(newOwner) {
        this.owner = newOwner;
    }

    /**
     * Useful methods to encapsulate project states
     *  CREATED, FUNDED, STARTED, EXECUTING, FINALIZING, COMPLETED
     */
    setCreated() {
        this.currentState = cpState.CREATED;
    }

    setFunded() {
        this.currentState = cpState.FUNDED;
    }

    setStarted() {
        this.currentState = cpState.STARTED;
    }

    setExecuting() {
        this.currentState = cpState.EXECUTING;
    }

    setFinalizing() {
        this.currentState = cpState.FINALIZING;
    }

    setCompleted() {
        this.currentState = cpState.COMPLETED;
    }

    isCreated() {
        return this.currentState === cpState.CREATED;
    }

    isFunded() {
        return this.currentState === cpState.FUNDED;
    }

    isStarted() {
        return this.currentState === cpState.STARTED;
    }

    isExecuting() {
        return this.currentState === cpState.EXECUTING;
    }

    isFinalizing() {
        return this.currentState === cpState.FINALIZING;
    }

    isCompleted() {
        return this.currentState === cpState.COMPLETED;
    }

    static fromBuffer(buffer) {
        return CharityProject.deserialize(buffer);
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    /**
     * Deserialize a state data to commercial paper
     * @param {Buffer} data to form back into the object
     */
    static deserialize(data) {
        return State.deserializeClass(data, CharityProject);
    }

    /**
     * Factory method to create a commercial paper object
     */
    static createInstance(owner, projectNumber, startDateTime, endDateTime, projectCost) {
        return new CharityProject({ owner, projectNumber, startDateTime, endDateTime, projectCost });
    }

    static getClass() {
        return 'org.charitably.charityproject';
    }
}

module.exports = CharityProject;

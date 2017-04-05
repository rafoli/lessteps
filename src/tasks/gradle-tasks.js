#!/usr/bin/env node

'use strict';

// ===================
// Module dependencies
// ===================

/**
 * External
 */

const ProgressBar = require('ascii-progress');
const fs = require("fs");
const path = require('path');

/**
 * Internal
 */

const log = require('../helpers/log-helper');
const shell = require('../helpers/shell-helper');
const walk = require('../helpers/walk-helper');

// ===================
// Attributes
// ===================

const MAX_PARALLEL_TASKS = 3;

// ==============
// Tasks
// ==============

const deploy = function(parallel) {

    run('clean deploy install', parallel)
}

const watch = function() {
    run('deploy -t -x test --offline')
}

const run = function(command, parallel) {

    let gitProjects = walk.list(/\.bnd/, null, {showProjects:true});

    let projects = [];

    let names = [];
    let commands = "";

    gitProjects.forEach(function(project) {

        // Project info
        let projectDir = path.dirname(project);
        let projectName = path.basename(projectDir);


        if (!parallel) {
            log.info(projectDir);
            let inst = `cd ${projectDir} && blade gw ${command}`
            log.simpleInfo(inst);
            shell.run(inst, null, { sync: true });
        }
        else {
            names.push(projectName);
            commands += `"cd ${projectDir} && blade gw ${command}" `;

            if (names.length == MAX_PARALLEL_TASKS) {
                let parallelRun = `concurrently --prefix "[{name}]" --names "${names}" ${commands} `; 
                shell.run(parallelRun , null, { sync: true });
                names = [];
                commands = "";             
            }
        }
        
    })

}

// ==============
// Export
// ==============

module.exports = {
    deploy,
    watch,
    run
}

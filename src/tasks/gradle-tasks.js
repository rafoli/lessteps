const fs = require("fs");
const log = require('../helpers/log-helper');
const path = require('path');
const shell = require('../helpers/shell-helper');
const walk = require('../helpers/walk-helper');
const ProgressBar = require('ascii-progress');


const deploy = function() {

    let gitProjects = walk.list(/\.bnd/);

    let projects = [];

    gitProjects.forEach(function(project) {

        // Project info
        let projectDir = path.dirname(project);
        let projectName = path.basename(projectDir);
        let reportFile = `./${projectDir}/build/reports/jacoco/test/html/index.html`;

        shell.run(`cd ${projectDir} && gradle clean install deployToLiferay`, null, { sync: true });
    })
}

const run = function(command) {

    let gitProjects = walk.list(/\.bnd/);

    let projects = [];

    gitProjects.forEach(function(project) {

        // Project info
        let projectDir = path.dirname(project);

        shell.run(`cd ${projectDir} && gradle ${command}`, null, { sync: true });
    })
}

module.exports = {
    deploy,
    run
}

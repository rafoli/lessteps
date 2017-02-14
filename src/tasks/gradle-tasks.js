const fs = require("fs");
const log = require('../helpers/log-helper');
const path = require('path');
const shell = require('../helpers/shell-helper');
const walk = require('../helpers/walk-helper');
const ProgressBar = require('ascii-progress');


const deploy = function(callback) {

    run('deploy install', callback)
}

const run = function(command, callback) {

    let gitProjects = walk.list(/\.bnd/);

    let projects = [];

    gitProjects.forEach(function(project) {

        // Project info
        let projectDir = path.dirname(project);

        log.info(projectDir);

        shell.run(`cd ${projectDir} && gradle ${command}`, null, { sync: true });
    })

    if (callback)
        callback();
}

module.exports = {
    deploy,
    run
}

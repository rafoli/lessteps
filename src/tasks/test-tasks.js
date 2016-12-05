const log = require('../helpers/log-helper');
const path = require('path');
const shell = require('../helpers/shell-helper');
const walk = require('../helpers/walk-helper');

const unitTest = function() {
    log.title("UnitTest...");

    let gitProjects = walk.list(/\.bnd/);

    gitProjects.forEach(function(project) {

        // Project info
        let projectDir = path.dirname(project);
        let projectName = path.basename(projectDir);

        log.info(projectDir);

        shell.run(`cd ${projectDir} && gradle unitTest`, null, {sync:true});
    });
}

module.exports = {
    unitTest
}

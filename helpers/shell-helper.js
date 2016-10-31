// ==============
// Helpers
// ==============

require('shelljs/global');

const log = require('./log-helper');

const run = function(command, cb) {
    log.simpleInfo(command);
    if (exec(command).code !== 0) {
        echo('Error: Git commit failed');
        exit(1);
    }
    else
    	cb();
}

module.exports = {
    run
}

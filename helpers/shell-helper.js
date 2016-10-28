// ==============
// Helpers
// ==============

require('shelljs/global');

const run = function(command, cb) {
    simpleLog(command);
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

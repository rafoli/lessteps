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

const log = function(text) {
    text = "==> " + text
    console.log(text.cyan);
}

const simpleLog = function(text) {
    text = "    " + text
    console.log(text.cyan);
}

const logTitle = function(text) {
    console.log(text.cyan.bold);
}

module.exports = {
    log,
    simpleLog,
    logTitle,
    run
}

// ==============
// Helpers
// ==============

const child_process = require('child_process');
require('shelljs/global');

const log = require('./log-helper');

const run = function(command, cb, options) {
    if (!options || (options && options.silent)) {

        let execOpts = {};
        if (options && options.silent) {
            execOpts.silent = true;
        } else
            log.simpleInfo(command);

        exec(command, execOpts, function(code, stdout, stderr) {
            if (code !== 0) {
                echo(command + ': failed');
                exit(1);
            } else
                cb(null, stdout);
        });

    } else {
        let c = command.split(' ')[0];
        let args = command.split(' ').slice(1);

        child_process.spawnSync(c, args, { shell: true, stdio: 'inherit' });
        if (cb)
            cb();
    }
}

module.exports = {
    run
}

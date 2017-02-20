#!/usr/bin/env node

'use strict';

// ===================
// Module dependencies
// ===================

/**
 * External
 */

const async = require('async');

/**
 * Internal
 */

const shell = require('../helpers/shell-helper');
const log = require('../helpers/log-helper');

// ==============
// Tasks
// ==============

const stopSybase = function(cb) {
    log.title("Stopping SyBase container...");
    shell.run('docker stop sybase-container || true', cb);
}

const removeSybase = function(cb) {
    log.title("Removing SyBase container...");
    shell.run('docker rm sybase-container || true', cb);
}

const startSybase = function(cb) {
    log.title("Starting a new SyBase container...");

    async.series([
        function(callback) {
            shell.run('docker run -i --name sybase-container -p 5000:5000 -h dksybase -d ifnazar/sybase_15_7 bash /sybase/start', callback);
        },
        function(callback) {
            log.info("Waiting for DB instance be ready...");
            setTimeout(function() {
                callback();
            }, 60000);
        }
    ], cb);
}

const createLPortal = function(scriptPath, cb) {
    log.title("Creating 'lportal' database...");

    let sqlFile = '/sybase/toRun.sql'

    async.series([
        function(callback) {
            shell.run('docker cp ' + scriptPath + ' sybase-container:' + sqlFile, callback);
        },
        function(callback) {
            shell.run('docker exec -i sybase-container bash /sybase/isql "-i' + sqlFile + '"', callback);
        }
    ], cb);

}

// ==============
// Export
// ==============

module.exports = {
    stopSybase,
    removeSybase,
    startSybase,
    createLPortal
}
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

const commonTasks = require('../tasks/common-tasks');
const sybaseTasks = require('../tasks/sybase-tasks');

// ==============
// Command
// ==============


const initdb = function(env, options) {
  async.auto({
    stop_sybase: function(cb) {
      sybaseTasks.stopSybase(cb);
    },
    remove_sybase: ['stop_sybase', function(results, cb) {
      sybaseTasks.removeSybase(cb);
    }],
    start_sybase: ['remove_sybase', function(results, cb) {
      sybaseTasks.startSybase(cb);
    }],
    sybase_script: ['start_sybase', function(results, cb) {
      commonTasks.downloadUrlTo('https://raw.githubusercontent.com/rafoli/lessteps/master/src/tasks/sybase-lportal.sql', '~/.liferay/scripts', cb);
    }],
    create_lportal: ['sybase_script', function(results, cb) {
      sybaseTasks.createLPortal(results.sybase_script, cb);
    }]
  });
}

// ==============
// Export
// ==============

module.exports = {
    initdb
}
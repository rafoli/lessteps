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

const gitTasks = require('../tasks/git-tasks');

// ==============
// Command
// ==============

const qa = function(options) {
  let branches = options.split(',');

  branches.forEach(function(branch) {
    gitTasks.branch(branch, false);
  });


  async.series([
      function(callback) {
          gitTasks.pull(callback);
      },
      function(callback) {
          gitTasks.status(callback);
      }
  ]);
}

// ==============
// Export
// ==============

module.exports = {
    qa
}
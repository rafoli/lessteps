#!/usr/bin/env node

'use strict';

// ===================
// Module dependencies
// ===================

/**
 * Internal
 */

const gitTasks = require('../tasks/git-tasks');

// ==============
// Command
// ==============

const git = function(options) {
  if (options.status)
    gitTasks.status();

  if (options.pull)
    gitTasks.pull();

  if (options.commit) {
    let message = options.commit;
    gitTasks.commit(message);
  }

  if (options.run) {
    let command = options.run;
    gitTasks.run(command);
  }
}

// ==============
// Export
// ==============

module.exports = {
    git
}
#!/usr/bin/env node

'use strict';

// ===================
// Module dependencies
// ===================

/**
 * Internal
 */

const gradleTasks = require('../tasks/gradle-tasks');

// ==============
// Command
// ==============

const gradle = function(options) {
  if (options.deploy)
    gradleTasks.deploy();

  if (options.run) {
    let command = options.run;
    gradleTasks.run(command);
  }
}

// ==============
// Export
// ==============

module.exports = {
    gradle
}
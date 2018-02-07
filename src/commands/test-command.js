#!/usr/bin/env node

'use strict';

// ===================
// Module dependencies
// ===================

/**
 * Internal
 */

const testTasks = require('../tasks/test-tasks');


// ==============
// Command
// ==============

const test = function(options) {
  if (options.unitTest)
    testTasks.unitTest();

  if (options.functionalTest)
    testTasks.functionalTest();

  if (options.sanityTest)
    testTasks.sanityTest();

  if (options.functionalTest)
    testTasks.functionalTest();

  if (options.coverage)
    testTasks.coverage();

  if (options.bddTest)
    testTasks.bddTest();
}

// ==============
// Export
// ==============

module.exports = {
    test
}
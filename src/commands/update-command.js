#!/usr/bin/env node

'use strict';

// ===================
// Module dependencies
// ===================

/**
 * Internal
 */

const coreTasks = require('../tasks/core-tasks');


// ==============
// Command
// ==============

const update = function() {
  coreTasks.update();
}

// ==============
// Export
// ==============

module.exports = {
    update
}
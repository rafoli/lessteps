#!/usr/bin/env node

'use strict';

// ===================
// Module dependencies
// ===================

/**
 * External
 */

const prompt = require("prompt");
const semver = require('semver');

/**
 * Internal
 */

const shell = require('../helpers/shell-helper');
const log = require('../helpers/log-helper');

// ==============
// Tasks
// ==============

const update = function() {
  log.title("Updating lessteps...");
  shell.run(`sudo npm update -g lessteps && sudo npm install -g lessteps`, null, { log: true });
}

const checkVersion = function(currentVersion, options, callback) {

  if (options.indexOf('-x') < 0) {
    shell.run('npm show lessteps version', function(err, res) {

      let latestVersion = res.replace(/(\r\n|\n|\r)/gm, "");

      if (semver.lt(currentVersion, latestVersion)) {
        askForUpdate(latestVersion);
      } else {
        callback();
      }

    }, { silent: true });
  } else {
    callback();
  }
}

const askForUpdate = function(latestVersion) {
  prompt.message = `Lessteps has a new version (${latestVersion})`.cyan;

  prompt.start();

  prompt.get({
    properties: {
      opt: {
        description: "Update (Y/n)?"
      }
    }
  }, function(err, result) {
    if (/[Y|y]/.test(result.opt) || !result.opt) {
      update();
    }
  });
}

// ==============
// Export
// ==============

module.exports = {
  checkVersion,
  update
}

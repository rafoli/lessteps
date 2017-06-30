#!/usr/bin/env node

'use strict';

// ===================
// Module dependencies
// ===================

/**
 * External
 */

const async = require('async');
const prop = require('properties-parser');
const fs = require('fs');
const path = require("path");

/**
 * Internal
 */

const shell = require('../helpers/shell-helper');
const log = require('../helpers/log-helper');

// ==============
// Tasks
// ==============

const cleanLiferayWorkspace = function(cb) {
  log.title("Cleaning...");

  async.series([
    function(callback) {
      log.info("Cleaning bundles folder...");
      shell.run('rm -rf bundles/', callback);
    },
    function(callback) {
      log.info("Cleaning build folder...");
      shell.run('rm -rf build/', callback);
    },
    function(callback) {
      shell.run('find modules -type d -name "build" | xargs rm -rf', callback);
    },
    function(callback) {
      log.info("Cleaning bin folder...");
      shell.run('rm -rf build/', callback);
    },
    function(callback) {
      shell.run('find modules -type d -name "build" | xargs rm -rf', callback);
    }
  ], cb);
}


const getGradleCommand = function() {
  var localCommand = "./gradlew";
  if (fs.existsSync(localCommand)) {
    return localCommand
  } else {
    return "gradle"
  }
};

const initBundle = function(options, cb) {
  log.title("Calling initBundle ...");

  let gradleCommand = getGradleCommand();
  let initBundle = gradleCommand + ' initBundle ';


  if (options.parent.rawArgs.indexOf('-x') > -1) {
    initBundle += '-x downloadBundle';
  }

  log.info(initBundle);
  shell.run(initBundle, cb);
}

const applyLicense = function(cb) {
  log.title("Apply license...");

  async.series([
    function(callback) {
      shell.run('mkdir bundles/deploy', callback);
    },
    function(callback) {
      shell.run('cp ~/.liferay/activation/activation-key-development.xml bundles/deploy', callback);
    }
  ], cb);
}

const applyPatch = function(patchingToolPath, fixPackPath, cb) {
  log.title("Applying fix-pack...");
  async.series([
    function(callback) {
      if (patchingToolPath) {
        log.info('Removing old [bundles/patching-tool]...');
        shell.run('rm -rf bundles/patching-tool/', callback);
      } else
        callback();
    },
    function(callback) {
      if (patchingToolPath) {
        log.info('Unziping patching-tool...');
        shell.run('unzip -o ' + patchingToolPath + ' -d bundles', callback);
      } else
        callback();
    },
    function(callback) {
      if (fixPackPath) {
        log.info('Copying fix-pack to [bundles/patching-tool/patches]...');
        shell.run('cp ' + fixPackPath + ' bundles/patching-tool/patches', callback);
      } else
        callback();
    },
    // function(callback) {
    //   if (fixPackPath) {
    //     log.info('Patching-tool: auto-discovery...');
    //     shell.run('sh bundles/patching-tool/patching-tool.sh auto-discovery', callback);
    //   } else
    //     callback();
    // },
    function(callback) {
      if (fixPackPath) {
        log.info('Patching-tool: install...');
        shell.run('sh bundles/patching-tool/patching-tool.sh install', callback);
      } else
        callback();
    }

  ], cb);
}

// ==============
// Export
// ==============

module.exports = {
  cleanLiferayWorkspace,
  initBundle,
  applyLicense,
  applyPatch
}

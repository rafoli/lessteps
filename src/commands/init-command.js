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
const liferayTasks = require('../tasks/liferay-tasks');

// ==============
// Command
// ==============

const init = function(options) {
  async.auto({
    clean_liferay_workspace: function(cb) {
      liferayTasks.cleanLiferayWorkspace(cb);
    },
    init_bundle: ['clean_liferay_workspace', function(results, cb) {
      liferayTasks.initBundle(options, cb);
    }],
    apply_license: ['init_bundle', function(results, cb) {
      liferayTasks.applyLicense(cb);
    }],
    patching_tool_path: ['apply_license', function(results, cb) {
      commonTasks.downloadFileTo('gradle.properties', 'liferay.patchingtool.bundle.url', '~/.liferay/patching-tool', cb);
    }],
    fix_pack_path: ['patching_tool_path', function(results, cb) {
      commonTasks.downloadFileTo('gradle.properties', 'liferay.fixpack.bundle.url', '~/.liferay/fix-packs', cb);
    }],
    applyPatch: ['fix_pack_path', function(results, cb) {
      liferayTasks.applyPatch(results.patching_tool_path, results.fix_pack_path, cb);
    }]
  });
}

// ==============
// Export
// ==============

module.exports = {
    init
}
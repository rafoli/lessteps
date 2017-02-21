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

const walk = require('../helpers/walk-helper');
const gitTasks = require('../tasks/git-tasks');
const gitlabTasks = require('../tasks/gitlab-tasks');

// ==============
// Command
// ==============

const mr = function(options) {

  walk.gitProjects().forEach(function(project) {

    async.auto({
      project_id: function(cb) {
        gitlabTasks.projectId(project, options, cb);
      },
      user_id: function(cb) {
        gitlabTasks.userId(project, options.user, cb);
      },
      source_branch: function(cb) {
        gitTasks.currentBranchName(project.gitPath, project.path, cb, {silent:true});
      },
      merge_request_id: ['project_id', 'user_id', 'source_branch', function(results, cb) {
      	options.projectId = results.project_id;
      	options.userId = results.user_id;
      	options.sourceBranch = String(results.source_branch).replace(/(\r\n|\n|\r)/gm,"");
        gitlabTasks.addMergeRequest(project, options, cb);
      }],
      update_merge_request: ['merge_request_id', function(results, cb) {
      	options.mergeRequestId = results.merge_request_id;
        gitlabTasks.updateMergeRequest(project, options, cb);
      }]      
    });

  });
}

// ==============
// Export
// ==============

module.exports = {
  mr
}

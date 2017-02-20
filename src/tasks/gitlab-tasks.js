#!/usr/bin/env node

'use strict';

// ===================
// Module dependencies
// ===================

/**
 * Internal
 */

const shell = require('../helpers/shell-helper');

// ==============
// Tasks
// ==============

const projectId = function(project, options, callback) {
  let command = `cd ${project.path} && gitlab projects --filter "item.name == '${project.name}' && item.namespace.name == '${options.group}'"`;

  shell.run(command, function(err, res) {
    var obj = JSON.parse(res);
    callback(null, obj[0].id);

  }, { silent: true });
}

const userId = function(project, userName, callback) {
  let command = `cd ${project.path} && gitlab users --filter "item.username == '${userName}'"`;

  shell.run(command, function(err, res) {
    var obj = JSON.parse(res);
    callback(null, obj[0].id);

  }, { silent: true });
}

const addMergeRequest = function(project, options, callback) {
  let command = `cd ${project.path} && gitlab addMergeRequest ${options.projectId} ${options.sourceBranch} ${options.targetBranch} ${options.userId} "${options.message}"`;
  console.log(command);
  callback();
  //shell.run(command, callback, { silent: true });
}

const updateMergeRequest = function(project, options, callback) {
  let command = `cd ${project.path} && gitlab updateMergeRequest ${options.projectId} 1188 -l ${options.labels}`;
  console.log(command);
  callback();
  //shell.run(command, callback, { silent: true });
}


// ==============
// Export
// ==============

module.exports = {
  mr,
  projectId,
  userId,
  addMergeRequest,
  updateMergeRequest
}

#!/usr/bin/env node

'use strict';

// ===================
// Module dependencies
// ===================

/**
 * Internal
 */

const log = require('../helpers/log-helper');
const shell = require('../helpers/shell-helper');

// ==============
// Tasks
// ==============

const projectId = function(project, options, callback) {
  let command = `cd ${project.path} && gitlab projects --filter "item.name == '${project.name}' && item.namespace.name == '${options.group}'"`;

  shell.run(command, function(err, res) {
    let obj = JSON.parse(res);
    callback(null, obj[0].id);

  }, { silent: true });
}

const userId = function(project, userName, callback) {
  let command = `cd ${project.path} && gitlab users --filter "item.username == '${userName}'"`;

  shell.run(command, function(err, res) {
    let obj = JSON.parse(res);
    callback(null, obj[0].id);

  }, { silent: true });
}

const addMergeRequest = function(project, options, callback) {
  let command = `cd ${project.path} && gitlab addMergeRequest ${options.projectId} ${options.sourceBranch} ${options.targetBranch} ${options.userId} "${options.message}"`;
  shell.run(command, function(err, res){
    let obj = JSON.parse(res);
    log.info(`Url: ${obj.web_url}`);
    callback(null, obj.id);
  }, { silent: true });
}

const updateMergeRequest = function(project, options, callback) {
  let command = `cd ${project.path} && gitlab updateMergeRequest ${options.projectId} ${options.mergeRequestId} -l ${options.labels}`;
  shell.run(command, callback, { silent: true });
}


// ==============
// Export
// ==============

module.exports = {
  projectId,
  userId,
  addMergeRequest,
  updateMergeRequest
}

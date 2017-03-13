#!/usr/bin/env node

'use strict';

// ===================
// Module dependencies
// ===================

/**
 * External
 */

const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

/**
 * External
 */

const log = require('./log-helper');

// ==============
// Helpers
// ==============

// List git projects
const gitProjects = function() {
  let projects = list(/\.git\/HEAD/g);

  let gitProjects = [];

  projects.forEach(function(project) {
    let gitPath = path.dirname(project);
    let projectPath = path.resolve(gitPath, '..');
    let projectName = path.basename(projectPath);


    gitProjects.push({
      gitPath: gitPath,
      path: projectPath,
      name: projectName
    });
  });

  return gitProjects;

}

// List bundle projects
const bundleProjects = function() {
  let projects = list(/\.bnd/);

  let bundleProjects = [];

  projects.forEach(function(project) {
    let projectPath = path.dirname(project);
    let projectName = path.basename(projectPath);

    bundleProjects.push({
      path: projectPath,
      name: projectName
    });
  });

  return bundleProjects;


}

// List based on pattern
const list = function(pattern, excludes) {

  // Update excludes from lessteps.yaml
  excludes = configureExcludes(excludes);

  let filelist = [];
  walkSync('.', filelist, excludes);

  let list = _.filter(filelist, function(o) {
    return (pattern).test(o);
  });

  return list;
}

// Find files
const walkSync = function(dir, filelist, excludes) {

  var files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach(function(file) {

    if (!excludes || (excludes.indexOf(file) < 0)) {

      let innerDir = path.join(dir, file);
      if (fs.statSync(innerDir).isDirectory()) {
        filelist = walkSync(innerDir, filelist, excludes);
      } else {
        filelist.push(innerDir);
      }

    }
  });
  return filelist;
};

// Update excludes from lessteps.yaml
const configureExcludes = function(excludes) {
  if (!excludes)
    excludes = [];

  try {
    let config = yaml.safeLoad(fs.readFileSync('./lessteps.yaml', 'utf8'));
    if (config.excludes)
      excludes = excludes.concat(config.excludes);
  } catch (e) {
    if (e.code === 'ENOENT') {}
    else 
      console.log(e);
  }

  if (excludes.length > 0)
      log.error("Excludes: " + excludes);

  return excludes;
}

// ==============
// Export
// ==============
module.exports = {
  list,
  bundleProjects,
  gitProjects
}

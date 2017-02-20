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

    if (!excludes || (excludes && file.indexOf(excludes) < 0)) {

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


// ==============
// Export
// ==============
module.exports = {
  list,
  bundleProjects,
  gitProjects
}

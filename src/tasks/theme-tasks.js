#!/usr/bin/env node

'use strict';

// ===================
// Module dependencies
// ===================

/**
 * External
 */

const fs = require("fs");
const path = require('path');
const prompt = require("prompt");

/**
 * Internal
 */

const log = require('../helpers/log-helper');
const shell = require('../helpers/shell-helper');
const walk = require('../helpers/walk-helper');

// ==============
// Tasks
// ==============

const deploy = function() {
  run('deploy')
}

const run = function(command) {


  let gitProjects = walk.list(/package\.json/, ['node_modules']);

  let projects = [];

  gitProjects.forEach(function(project) {
    // Project info
    let projectDir = path.dirname(project);

    try {
      let packageJsonContent = fs.readFileSync(projectDir + '/package.json', "utf8");

      if (packageJsonContent && packageJsonContent.indexOf('liferay-theme-tasks') >= 0) {

        let themeConfig = { LiferayTheme: { deployPath: null } };
        let themeFile = projectDir + '/liferay-theme.json';

        try {
          let liferayTheme = fs.readFileSync(themeFile, "utf8");

          themeConfig = JSON.parse(liferayTheme);
        } catch (err) {}

        if (!themeConfig.LiferayTheme.deployPath) {

          askForDeployPath(function(err, res) {
            themeConfig.LiferayTheme.deployPath = res;
            fs.writeFileSync(themeFile, JSON.stringify(themeConfig), 'utf8');
            runCommand(projectDir, command);
          })

        } else {
          runCommand(projectDir, command);
        }
      }
    } catch (err) {}



  })
}

const runCommand = function(projectDir, command) {
  log.info(projectDir);

  shell.run(`cd ${projectDir} && gulp ${command}`, null, { sync: true });
}

const askForDeployPath = function(callback) {
  prompt.message = `Liferay's Theme: deploy folder not found!`.red;

  prompt.start();

  prompt.get({
    properties: {
      opt: {
        description: "? Enter your deploy directory (../[BUNDLE_PATH]/bundles/deploy)".cyan
      }
    }
  }, function(err, result) {
    if (err) console.log(err);
    else {
      if (result.opt) {
        callback(null, result.opt);
      }
    }
  });
}

// ==============
// Export
// ==============

module.exports = {
  deploy,
  run
}

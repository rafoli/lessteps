const fs = require("fs");
const log = require('../helpers/log-helper');
const path = require('path');
const shell = require('../helpers/shell-helper');
const walk = require('../helpers/walk-helper');
const prompt = require("prompt");

const deploy = function() {
  run('deploy')
}

const run = function(command) {


  let gitProjects = walk.list(/package\.json/, 'node_modules');

  let projects = [];

  gitProjects.forEach(function(project) {
    // Project info
    let projectDir = path.dirname(project);

    try {
      let packageJsonContent = fs.readFileSync(projectDir + '/package.json');

      if (packageJsonContent && packageJsonContent.includes('liferay-theme-tasks')) {

        let themeConfig = { LiferayTheme: { deployPath: null } };
        let themeFile = projectDir + '/liferay-theme.json';

        try {
          liferayTheme = fs.readFileSync(themeFile);
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

module.exports = {
  deploy,
  run
}

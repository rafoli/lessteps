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

  let gitProjects = walk.list(/liferay-theme\.json/);

  let projects = [];

  gitProjects.forEach(function(project) {

    // Project info
    let projectDir = path.dirname(project);

    let themeFile = projectDir + '/liferay-theme.json';

    let content = fs.readFileSync(themeFile);

    var themeConfig = JSON.parse(content);

    if (!themeConfig || !themeConfig.LiferayTheme || !themeConfig.LiferayTheme.deployPath) {
      askForDeployPath(function(err, res) {
        themeConfig.LiferayTheme.deployPath = res;
        fs.writeFileSync(themeFile.toString(), JSON.stringify(themeConfig), 'utf8');
        runCommand(projectDir, command);
      })
    } else {
      runCommand(projectDir, command);
    }

  })
}

const runCommand = function(projectDir, command) {
  log.info(projectDir);

  shell.run(`cd ${projectDir} && gulp ${command}`, null, { sync: true });
}

const askForDeployPath = function(callback) {
  prompt.message = `Theme deploy folder not found.`.cyan;

  prompt.start();

  prompt.get({
    properties: {
      opt: {
        description: "? Enter your deploy directory (../[BUNDLE_PATH]/bundles/deploy)"
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

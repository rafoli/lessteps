// ==============
// Tasks
// ==============

const shell = require('../helpers/shell-helper');
const log = require('../helpers/log-helper');
const prompt = require("prompt");
const semver = require('semver');

const update = function() {
  log.title("Updating lessteps...");
  shell.run(`sudo npm remove -g lessteps && sudo npm install -g lessteps`, null, { log: true });
}

const checkVersion = function(currentVersion, callback) {
  shell.run('npm show lessteps version', function(err, res) {

    let latestVersion = res.replace(/(\r\n|\n|\r)/gm, "");

    if (semver.lt(currentVersion, latestVersion)) {
      askForUpdate(latestVersion);
    } else {
      callback();
    }

  }, { silent: true });
}

const askForUpdate = function(latestVersion) {
  prompt.message = `Lessteps has a new version (${latestVersion})`.cyan;

  prompt.start();

  prompt.get({
    properties: {
      opt: {
        description: "Update (Y/n)?"
      }
    }
  }, function(err, result) {
    if (/[Y|y]/.test(result.opt) || !result.opt) {
      update();
    }
  });
}


module.exports = {
  checkVersion,
  update
}

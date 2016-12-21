const _ = require('lodash');
const async = require('async');

const path = require('path');
const fs = require('fs');

const log = require('../helpers/log-helper');
const shell = require('../helpers/shell-helper');
const walk = require('../helpers/walk-helper');


// ==============
// Tasks
// ==============

const status = function() {

  log.title("Git status...");

  let gitProjects = walk.list(/\.git\/HEAD/g);

  gitProjects.forEach(function(project) {

    // Project info
    let gitDir = path.dirname(project);
    let projectDir = path.resolve(gitDir, '..');
    let projectName = path.basename(projectDir);

    let G = `git --git-dir=${gitDir} --work-tree=${projectDir}`

    // Shell opts
    let gOpts = { silent: true };

    async.auto({
      branch: function(cb) {
        getCurrentBranchName(gitDir, projectDir, cb, gOpts);
      },
      local: function(cb) {
        shell.run(`${G} rev-parse @{0}`, cb, gOpts);
      },
      remote: function(cb) {
        shell.run(`${G} rev-parse @{u}`, cb, gOpts);
      },
      base: function(cb) {
        shell.run(`${G} merge-base @{0} @{u}`, cb, gOpts);
      },
      changesNotStaged: function(cb) {
        shell.run(`${G} diff`, cb, gOpts);
      },
      changesStaged: function(cb) {
        shell.run(`${G} diff --cached`, cb, gOpts);
      },
      untracked: function(cb) {
        shell.run(`${G} ls-files --exclude-standard --others`, cb, gOpts);
      },
    }, function(err, res) {
      if (err)
        console.log(err);
      else {

        let branchName = res.branch.replace(/(\r\n|\n|\r)/gm, "");
        let title = `(${branchName}) ${projectName.cyan}`;

        if (res.changesNotStaged.length > 0 || res.changesStaged.length > 0) {
          log.dottedError(title, 'changes to commit');
        } else {
          if (res.local == res.remote) {
            if (res.untracked.length > 0) {
              log.dottedError(title, 'untracked files');
            } else
              log.dottedInfo(title, 'ok');
          } else if (res.local == res.base) {
            log.dottedError(title, 'needs to be pulled');
          } else if (res.remote == res.base) {
            log.dottedError(title, 'needs to be pushed');
          } else {
            log.dottedError(title, 'diverged');
          }
        }

        shell.run(`${G} status -s`, null, { sync: true });
      }
    });
  });
}

const pull = function() {

  log.title("Git pull...");

  let gitProjects = walk.list(/\.git\/HEAD/g);

  gitProjects.forEach(function(project) {

    // Project info
    let gitDir = path.dirname(project);
    let projectDir = path.resolve(gitDir, '..');
    let projectName = path.basename(projectDir);

    async.auto({
      branch: function(callback) {
        getCurrentBranchName(gitDir, projectDir, callback, { silent: true });
      },
      pull_branch: ['branch', function(results, callback) {
        let G = `git --git-dir=${gitDir} --work-tree=${projectDir}`
        shell.run(`${G} pull origin ${results.branch}`, callback, { log: true });
      }]
    });
  })
}

const commit = function(message) {

  log.title("Git commit...");

  let gitProjects = walk.list(/\.git\/HEAD/g);

  gitProjects.forEach(function(project) {

    // Project info
    let gitDir = path.dirname(project);
    let projectDir = path.resolve(gitDir, '..');
    let projectName = path.basename(projectDir);

    var pattern = /\w{3,5}-\d{1,10} [A-Z]\w*/;

    if (pattern.test(message)) {
      let G = `git --git-dir=${gitDir} --work-tree=${projectDir}`
      shell.run(`${G} commit -m "${message}"`, null, { log: true });
    } else
      log.error("You should use the pattern: [" + pattern + "]. For example [AAA-0000 Commit message]");

  })
}

const run = function(command) {

  log.title("Git - commit...");

  let gitProjects = walk.list(/\.git\/HEAD/g);

  gitProjects.forEach(function(project) {

    // Project info
    let gitDir = path.dirname(project);
    let projectDir = path.resolve(gitDir, '..');
    let projectName = path.basename(projectDir);

    let G = `git --git-dir=${gitDir} --work-tree=${projectDir}`
    shell.run(`${G} ${command}`, null, { log: true });

  })
}

const branch = function(name) {

  log.title("Git - new branch...");

  let gitProjects = walk.list(/\.git\/HEAD/g);

  gitProjects.forEach(function(project) {

    // Project info
    let gitDir = path.dirname(project);
    let projectDir = path.resolve(gitDir, '..');
    let projectName = path.basename(projectDir);

    let G = `git --git-dir=${gitDir} --work-tree=${projectDir}`
    shell.run(`${G} checkout -b ${name}`, null, { log: true });
    shell.run(`${G} push --set-upstream origin ${name}`, null, { log: true });

  })
}


//shell.run(`git --git-dir=${gitDir} remote set-url origin http://bgcldevops/bgp-bel-portal/${projectName}`, function(err, res){}, {log:true});


// shell.run(`git --git-dir=${gitDir} push --set-upstream origin liferay_merge`, function(err, res) {
//     if (!err) {
//         console.log("Project: ", projectName);
//     }
// }, { silent: true });

const getCurrentBranchName = function(gitDir, projectDir, callback, options) {
  let G = `git --git-dir=${gitDir} --work-tree=${projectDir}`

  shell.run(`${G} rev-parse --symbolic-full-name --abbrev-ref HEAD`, callback, options);
}




module.exports = {
  branch,
  status,
  pull,
  commit,
  run
}

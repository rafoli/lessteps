#!/usr/bin/env node

'use strict';

// ===================
// Module dependencies
// ===================

/**
 * External
 */

const _ = require('lodash');
const async = require('async');
const path = require('path');
const prompt = require('prompt');
const fs = require('fs');

/**
 * Internal
 */

const log = require('../helpers/log-helper');
const shell = require('../helpers/shell-helper');
const walk = require('../helpers/walk-helper');


// ==============
// Tasks
// ==============

const status = function(callback) {

  log.title("Git status...");

  async.each(walk.gitProjects(), function(project, cbEach) {

    let G = `git --git-dir=${project.gitPath} --work-tree=${project.path}`

    // Shell opts
    let gOpts = { silent: true };

    async.auto({
      branch: function(cb) {
        currentBranchName(project.gitPath, project.path, cb, gOpts);
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
        let title = `(${branchName}) ${project.name.cyan}`;

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

        cbEach();
      }
    });
  }, function(err) {
    if (err && callback)
      callback(err);
    if (callback)
      callback();
  });
}

const pull = function(callback) {

  log.title("Git pull...");

  async.each(walk.gitProjects(), function(project, cb) {

    async.auto({
      branch: function(cbAuto) {
        currentBranchName(project.gitPath, project.path, cbAuto, { silent: true });
      },
      pull_branch: ['branch', function(results, cbAuto) {
        let G = `git --git-dir=${project.gitPath} --work-tree=${project.path}`
        log.info(project.path);
        shell.run(`${G} pull`, cbAuto, { log: true });
      }]
    }, cb);


  }, function(err) {
    if (err && callback)
      callback(err);
    if (callback)
      callback();
  });

}

const commit = function(message) {

  log.title("Git commit...");

  walk.gitProjects().forEach(function(project) {

    var pattern = /\w{3,5}-\d{1,10} [A-Z]\w*/;

    if (pattern.test(message)) {
      let G = `git --git-dir=${project.gitPath} --work-tree=${project.path}`
      shell.run(`${G} commit -m "${message}"`, null, { log: true });
    } else
      log.error("You should use the pattern: [" + pattern + "]. For example [AAA-0000 Commit message]");

  })
}

const run = function(command) {

  log.title(`Git - run [${command}]...`);

  walk.gitProjects().forEach(function(project) {

    let G = `git --git-dir=${project.gitPath} --work-tree=${project.path}`
    shell.run(`${G} ${command}`, null, { log: true });

  })
}

const branch = function(name, createIfNotExist) {

  log.title("Git - branch...");

  walk.gitProjects().forEach(function(project) {

    log.info(project.path);

    let G = `git --git-dir=${project.gitPath} --work-tree=${project.path}`

    shell.run(`${G} fetch`, null, { log: true });

    if (createIfNotExist) {
      shell.run(`${G} checkout -b ${name}`, null, { log: true });
      shell.run(`${G} push --set-upstream origin ${name}`, null, { log: true });
    } else {
      shell.run(`${G} checkout ${name}`, null, { log: true });
      console.log('');
    }


  });

}

const projectName = function(project, callback) {

  let G = `git --git-dir=${project.gitPath} --work-tree=${project.path}`

  shell.run(`${G} config --local remote.origin.url|sed -n 's#.*/\\([^.]*\\)\\.git#\\1#p'`, callback, { silent: true });
}

const currentBranchName = function(gitPath, projectPath, callback, options) {
  let G = `git --git-dir=${project.gitPath} --work-tree=${project.path}`

  shell.run(`${G} rev-parse --symbolic-full-name --abbrev-ref HEAD`, callback, options);
}

// ==============
// Export
// ==============

module.exports = {
  branch,
  currentBranchName,
  status,
  pull,
  projectName,
  commit,
  run
}

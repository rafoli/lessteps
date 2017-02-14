#!/usr/bin/env node

'use strict';

/**
 * Module dependencies.
 */

const common = require('./tasks/common-tasks');
const core = require('./tasks/core-tasks');
const git = require('./tasks/git-tasks');
const gradle = require('./tasks/gradle-tasks');
const liferay = require('./tasks/liferay-tasks');
const sybase = require('./tasks/sybase-tasks');
const test = require('./tasks/test-tasks');
const theme = require('./tasks/theme-tasks');

const async = require('async');
const colors = require('colors');
const program = require('commander');

// ==============
// Commands
// ==============

const initCommand = function(options) {
  async.auto({
    clean_liferay_workspace: function(cb) {
      liferay.cleanLiferayWorkspace(cb);
    },
    init_bundle: ['clean_liferay_workspace', function(results, cb) {
      liferay.initBundle(options, cb);
    }],
    apply_license: ['init_bundle', function(results, cb) {
      liferay.applyLicense(cb);
    }],
    patching_tool_path: ['apply_license', function(results, cb) {
      common.downloadFileTo('gradle.properties', 'liferay.patchingtool.bundle.url', '~/.liferay/patching-tool', cb);
    }],
    fix_pack_path: ['patching_tool_path', function(results, cb) {
      common.downloadFileTo('gradle.properties', 'liferay.fixpack.bundle.url', '~/.liferay/fix-packs', cb);
    }],
    applyPatch: ['fix_pack_path', function(results, cb) {
      liferay.applyPatch(results.patching_tool_path, results.fix_pack_path, cb);
    }]
  });
}

const initdbCommand = function(env, options) {
  async.auto({
    stop_sybase: function(cb) {
      sybase.stopSybase(cb);
    },
    remove_sybase: ['stop_sybase', function(results, cb) {
      sybase.removeSybase(cb);
    }],
    start_sybase: ['remove_sybase', function(results, cb) {
      sybase.startSybase(cb);
    }],
    sybase_script: ['start_sybase', function(results, cb) {
      common.downloadUrlTo('https://raw.githubusercontent.com/rafoli/lessteps/master/src/tasks/sybase-lportal.sql', '~/.liferay/scripts', cb);
    }],
    create_lportal: ['sybase_script', function(results, cb) {
      sybase.createLPortal(results.sybase_script, cb);
    }]
  });
}

const gitCommand = function(options) {
  if (options.status)
    status();

  if (options.pull)
    pull();

  if (options.commit) {
    let message = options.commit;
    commit(message);
  }

  if (options.run) {
    let command = options.run;
    git.run(command);
  }
}

const gradleCommand = function(options) {
  if (options.deploy)
    deploy();

  if (options.run) {
    let command = options.run;
    gradle.run(command);
  }
}

const unitTestCommand = function(options) {
  if (options.unitTest)
    test.unitTest();

  if (options.functionalTest)
    test.functionalTest();

  if (options.sanityTest)
    test.sanityTest();

  if (options.functionalTest)
    test.functionalTest();

  if (options.coverage)
    test.coverage();
}

const qaCommand = function(options) {
  let branches = options.split(',');

  branches.forEach(function(branch) {
    git.branch(branch, false);
  });


  async.series([
      function(callback) {
          git.pull(callback);
      },
      function(callback) {
          git.status(callback);
      }
  ]);


}

// =========
// Shortcuts
// =========

const commit = function(message) {
  git.commit(message);
}

const branch = function(name) {
  git.branch(name, true);
}

const deploy = function() {
  gradle.deploy();
}

const deployParallel = function() {
  gradle.deploy(true);
}

const pull = function() {
  git.pull();
}

const status = function() {
  git.status();
}

const update = function() {
  core.update();
}

// ===================
// Program definitions
// ===================

// Header
program
  .version('0.6.1');

program
  .option('-c, --commit [message]', 'Commit projects', commit)
  .option('-d, --deploy', 'Deploy projects', deploy)
  .option('-f, --deployParallel', 'Deploy projects in Parallel', deployParallel)
  .option('-p, --pull', 'Pull projects', pull)
  .option('-b, --branch [name]', 'Create a new branch', branch)
  .option('-s, --status', 'Project status', status)
  .option('-u, --update', 'Update ' + 'les'.cyan + 's' + 'teps'.red, update)
  .option('-x, --skipDownload', 'Skip downloads and checks', function(){});

// init
program
  .command('init')
  .option('-x, --skipDownload', 'Skip download')
  .description('Create Liferay\'s bundle (default profile - dev)')
  .action(initCommand);

// initdb
program
  .command('initdb')
  .description('Init a DB instance')
  .action(initdbCommand);

// git
program
  .command('git')
  .description('Git commands')
  .option('-s, --status', 'Projects status')
  .option('-p, --pull', 'Pull projects')
  .option('-c, --commit [message]', 'Commit projects')
  .option('-b, --branch [name]', 'Create a new branch')
  .option('-r, --run [command]', 'Command')
  .action(gitCommand);

// gradle
program
  .command('gradle')
  .description('Gradle commands')
  .option('-d, --deploy', 'Build, Install and Deploy')
  .option('-dp, --deployParallel', 'Build, Install and Deploy in Parallel')
  .option('-r, --run [command]', 'Command')
  .action(gradleCommand);

// test
program
  .command('test')
  .description('Git commands')
  .option('-u, --unitTest', 'Run unitTest')
  .option('-f, --functionalTest', 'Run functionalTest')
  .option('-s, --sanityTest', 'Run sanityTest')
  .option('-i, --integrationTest', 'Run integrationTest')
  .option('-c, --coverage', 'Run test coverage')
  .action(unitTestCommand);

// qa
program
  .command('qa')
  .description('QA commands')
  .action(qaCommand);  

// Title
console.log('┬  ┌─┐┌─┐'.cyan + '┌─┐' + '┌┬┐┌─┐┌─┐┌─┐'.red);
console.log('│  ├┤ └─┐'.cyan + '└─┐' + ' │ ├┤ ├─┘└─┐'.red);
console.log('┴─┘└─┘└─┘'.cyan + '└─┘' + ' ┴ └─┘┴  └─┘'.red + ' v' + program.version());


core.checkVersion(program.version(), process.argv, function(err, res) {
  if (err) console.log(err);
  else // Parse command line
    program.parse(process.argv);
});

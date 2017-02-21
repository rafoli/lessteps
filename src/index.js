#!/usr/bin/env node

'use strict';

// ===================
// Module dependencies
// ===================

/**
 * External
 */

const async = require('async');
const colors = require('colors');
const program = require('commander');

/**
 * Internal
 */

// Tasks
const core = require('./tasks/core-tasks');
const git = require('./tasks/git-tasks');
// Commands
const initCommand = require('./commands/init-command');
const initdbCommand = require('./commands/initdb-command');
const gradleCommand = require('./commands/gradle-command');
const gitCommand = require('./commands/git-command');
const mrCommand = require('./commands/mr-command');
const qaCommand = require('./commands/qa-command');
const testCommand = require('./commands/test-command');
const updateCommand = require('./commands/test-command');

// =========
// Shortcuts
// =========

const statusShortcut = function() {
  git.status();
}

const deployShortcut = function() {
  gradle.deploy();
}

const pullShortcut = function() {
  git.pull();
}

const branchShortcut = function(name) {
  git.branch(name, true);
}


// ===================
// Program definitions
// ===================

// Header
program
  .version('0.7.0');

program
  .option('-s, --status', 'Projects status', statusShortcut)
  .option('-b, --branch [name]', 'Create a new branch', branchShortcut)
  .option('-d, --deploy', 'Deploy projects', deployShortcut)
  .option('-p, --pull', 'Pull projects', pullShortcut)
  .option('-x, --skipDownload', 'Skip downloads and checks', function(){});

// init
program
  .command('init')
  .option('-x, --skipDownload', 'Skip download')
  .description('Create Liferay\'s bundle (default profile - dev)')
  .action(initCommand.init);

// initdb
program
  .command('initdb')
  .description('Init a DB instance')
  .action(initdbCommand.initdb);

// update
program
  .command('update')
  .description('Update ' + 'les'.cyan + 's' + 'teps'.red)
  .action(updateCommand.update);  


// git
program
  .command('git')
  .description('Git commands')
  .option('-s, --status', 'Projects status')
  .option('-p, --pull', 'Pull projects')
  .option('-c, --commit [message]', 'Commit projects')
  .option('-b, --branch [name]', 'Create a new branch')
  .option('-r, --run [command]', 'Command')
  .action(gitCommand.git);

// gradle
program
  .command('gradle')
  .description('Gradle commands')
  .option('-d, --deploy', 'Build, Install and Deploy')
  .option('-dp, --deployParallel', 'Build, Install and Deploy in Parallel')
  .option('-r, --run [command]', 'Command')
  .action(gradleCommand.gradle);

// test
program
  .command('test')
  .description('Git commands')
  .option('-u, --unitTest', 'Run unitTest')
  .option('-f, --functionalTest', 'Run functionalTest')
  .option('-s, --sanityTest', 'Run sanityTest')
  .option('-i, --integrationTest', 'Run integrationTest')
  .option('-c, --coverage', 'Run test coverage')
  .action(testCommand.test);

// qa
program
  .command('qa')
  .description('QA commands')
  .action(qaCommand.qa);  

// mr
program
  .command('mr')
  .option('-g, --group [group]', 'Owner username')
  .option('-u, --user [user]', 'User/Assigne name')
  .option('-t, --targetBranch [targetBranch]', 'Target branch')
  .option('-m, --message [message]', 'Message of MR')
  .option('-d, --description [description]', 'Description of MR')
  .option('-l, --labels [labels]', 'Labels for MR as a comma-separated list')
  .description('MR commands')
  .action(mrCommand.mr);   

// Title
console.log('┬  ┌─┐┌─┐'.cyan + '┌─┐' + '┌┬┐┌─┐┌─┐┌─┐'.red);
console.log('│  ├┤ └─┐'.cyan + '└─┐' + ' │ ├┤ ├─┘└─┐'.red);
console.log('┴─┘└─┘└─┘'.cyan + '└─┘' + ' ┴ └─┘┴  └─┘'.red + ' v' + program.version());


core.checkVersion(program.version(), process.argv, function(err, res) {
  if (err) console.log(err);
  else // Parse command line
    program.parse(process.argv);
});

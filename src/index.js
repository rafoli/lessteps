#!/usr/bin/env node

'use strict';

/**
 * Module dependencies.
 */

const common = require('./tasks/common-tasks');
const git = require('./tasks/git-tasks');
const gradle = require('./tasks/gradle-tasks');
const liferay = require('./tasks/liferay-tasks');
const sybase = require('./tasks/sybase-tasks');
const test = require('./tasks/test-tasks');

const async = require('async');
const colors = require('colors');
const program = require('commander');

// ==============
// Commands
// ==============

const initCommand = function(env, options) {
    async.auto({
        clean_liferay_workspace: function(cb) {
            liferay.cleanLiferayWorkspace(cb);
        },
        init_bundle: ['clean_liferay_workspace', function(results, cb) {
            liferay.initBundle(cb);
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

// =========
// Shortcuts
// =========

const commit = function(message) {
    git.commit(message);
}

const deploy = function() {
    gradle.deploy();
}

const pull = function() {
    git.pull();
}

const status = function() {
    git.status();
}

// ===================
// Program definitions
// ===================

// Header
program
    .version('0.3.1');

program
    .option('-c, --commit [message]', 'Commit projects', commit)
    .option('-d, --deploy', 'Commit projects', deploy)
    .option('-p, --pull', 'Pull projects', pull)
    .option('-s, --status', 'Project status', status);

// init
program
    .command('init')
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
    .action(gitCommand);

// gradle
program
    .command('gradle')
    .description('Gradle commands')
    .option('-d, --deploy', 'Build, Install and Deploy')
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

// Title
console.log('┬  ┌─┐┌─┐'.cyan + '┌─┐' + '┌┬┐┌─┐┌─┐┌─┐'.red);
console.log('│  ├┤ └─┐'.cyan + '└─┐' + ' │ ├┤ ├─┘└─┐'.red);
console.log('┴─┘└─┘└─┘'.cyan + '└─┘' + ' ┴ └─┘┴  └─┘'.red + ' v' + program.version());

// Parse command line
program.parse(process.argv);

#!/usr/bin/env node

'use strict';

/**
 * Module dependencies.
 */

const h = require('./helpers');
const tasks = require('./tasks');

const async = require('async');
const colors = require('colors');
const program = require('commander');

// ==============
// Commands
// ==============

const initCommand = function(env, options) {
    async.auto({
        clean_liferay_workspace: function(cb) {
            tasks.cleanLiferayWorkspace(cb);
        },
        init_bundle: ['clean_liferay_workspace', function(results, cb) {
            tasks.initBundle(cb);
        }],
        apply_license: ['init_bundle', function(results, cb) {
            tasks.applyLicense(cb);
        }],
        patching_tool_path: ['apply_license', function(results, cb) {
            tasks.downloadFileTo('gradle.properties', 'liferay.patchingtool.bundle.url', '~/.liferay/patching-tool', cb);
        }],
        fix_pack_path: ['patching_tool_path', function(results, cb) {
            tasks.downloadFileTo('gradle.properties', 'liferay.fixpack.bundle.url', '~/.liferay/fix-packs', cb);
        }],
        applyPatch: ['fix_pack_path', function(results, cb) {
            tasks.applyPatch(results.patching_tool_path, results.fix_pack_path, cb);
        }]
    });
}

// ==============
// Program definitions
// ==============

// Header
program
    .version('0.1.2')
    .option('-p, --profile', 'Choose config profile')

// Init
program
    .command('init')
    .description('Create Liferay\'s bundle')
    .action(initCommand);

program
    .command('initdb')
    .description('Init a DB instance');

// Title
console.log('┬  ┌─┐┌─┐'.cyan + '┌─┐' + '┌┬┐┌─┐┌─┐┌─┐'.red);
console.log('│  ├┤ └─┐'.cyan + '└─┐' + ' │ ├┤ ├─┘└─┐'.red);
console.log('┴─┘└─┘└─┘'.cyan + '└─┘' + ' ┴ └─┘┴  └─┘'.red + ' v' + program.version());

// Parse command line
program.parse(process.argv);

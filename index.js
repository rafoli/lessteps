#!/usr/bin/env node

'use strict';

/**
 * Module dependencies.
 */

const common = require('./tasks/common-tasks');
const liferay = require('./tasks/liferay-tasks');
const sybase = require('./tasks/sybase-tasks');

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
            common.downloadFileTo('gradle.properties', 'liferay.database.sybase.script.url', '~/.liferay/scripts', cb);
        }],
        remove_sybase: ['download_sybase_script', function(results, cb) {
            sybase.createLPortal('~/.liferay/scripts/' + results.sybase_script, cb);
        }
    });
}

// ==============
// Program definitions
// ==============

// Header
program
    .version('0.1.2');

// init
program
    .command('init [profile]')
    .description('Create Liferay\'s bundle (default profile - dev)')
    .action(initCommand); 

// initdb
program
    .command('initdb [type]')
    .description('Init a DB instance', initdbCommand)

// Title
console.log('┬  ┌─┐┌─┐'.cyan + '┌─┐' + '┌┬┐┌─┐┌─┐┌─┐'.red);
console.log('│  ├┤ └─┐'.cyan + '└─┐' + ' │ ├┤ ├─┘└─┐'.red);
console.log('┴─┘└─┘└─┘'.cyan + '└─┘' + ' ┴ └─┘┴  └─┘'.red + ' v' + program.version());

// Parse command line
program.parse(process.argv);

// ==============
// Tasks
// ==============

const h = require('./helpers');

const async = require('async');
const prop = require('properties-parser');
const fs = require('fs');
const path = require("path");


const cleanLiferayWorkspace = function(cb) {
    h.logTitle("Cleaning...");

    async.series([
        function(callback) {
            h.log("Cleaning bundles folder...");
            h.run('rm -rf bundles/', callback);
        },
        function(callback) {
            h.log("Cleaning build folder...");
            h.run('rm -rf build/', callback);
        },
        function(callback) {
            h.run('find modules -type d -name "build" | xargs rm -rf', callback);
        },
        function(callback) {
            h.log("Cleaning bin folder...");
            h.run('rm -rf build/', callback);
        },
        function(callback) {
            h.run('find modules -type d -name "build" | xargs rm -rf', callback);
        }
    ], cb);
}

const initBundle = function(cb) {
    h.logTitle("Calling initBundle and deploy...");

    h.run('gradle initBundle deploy', cb);
}

const applyLicense = function(cb) {
    h.logTitle("Apply license...");

    async.series([
        function(callback) {
            h.run('mkdir bundles/deploy', callback);
        },
        function(callback) {
            h.run('cp ~/.liferay/activation/activation-key-development.xml bundles/deploy', callback);
        }
    ], cb);
}

const downloadFileTo = function(propertiesFile, key, toDir, cb) {
    h.logTitle("Downloading file...");
    prop.read(propertiesFile, function(err, data) {
        if (err)
            cb(err);
        let fileUrl = data[key];
        h.run('wget -P ' + toDir + ' -N ' + fileUrl, function() {
            let fileName = path.basename(fileUrl);
            cb(null, (toDir + '/' + fileName ));
        });
    });
}

const applyPatch = function(patchingToolPath, fixPackPath, cb) {
    h.logTitle("Applying fix-pack...");
    async.series([
        function(callback) {
            h.log('Removing old [bundles/patching-tool]...');
            h.run('rm -rf bundles/patching-tool/', callback);
        },
        function(callback) {
            h.log('Unziping patching-tool...');
            h.run('unzip -o ' + patchingToolPath + ' -d bundles', callback);
        },
        function(callback) {
            h.log('Copying fix-pack to [bundles/patching-tool/patches]...');
            h.run('cp ' + fixPackPath + ' bundles/patching-tool/patches', callback);
        },
        function(callback) {
            h.log('Patching-tool: auto-discovery...');
            h.run('sh bundles/patching-tool/patching-tool.sh auto-discovery', callback);
        },
        function(callback) {
            h.log('Patching-tool: install...');
            h.run('sh bundles/patching-tool/patching-tool.sh install', callback);
        }

    ], cb);
}

module.exports = {
    cleanLiferayWorkspace,
    initBundle,
    applyLicense,
    downloadFileTo,
    applyPatch
}

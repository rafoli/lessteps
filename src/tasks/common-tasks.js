#!/usr/bin/env node

'use strict';

// ===================
// Module dependencies
// ===================

/**
 * External
 */

const async = require('async');
const prop = require('properties-parser');
const path = require("path");

/**
 * Internal
 */

const shell = require('../helpers/shell-helper');
const log = require('../helpers/log-helper');

// ==============
// Tasks
// ==============


const downloadFileTo = function(propertiesFile, key, toDir, cb) {
  log.title("Downloading file...");
  prop.read(propertiesFile, function(err, data) {
    if (err)
      cb(err);
    let fileUrl = data[key];
    if (fileUrl) {
      shell.run('wget -P ' + toDir + ' -N ' + fileUrl, function() {
        let fileName = path.basename(fileUrl);
        cb(null, (toDir + '/' + fileName));
      });
    } else
      cb();
  });
}

const downloadUrlTo = function(fileUrl, toDir, cb) {
  log.title("Downloading url...");
  shell.run('wget -P ' + toDir + ' -N ' + fileUrl, function() {
    let fileName = path.basename(fileUrl);
    cb(null, (toDir + '/' + fileName));
  });
}

// ==============
// Export
// ==============

module.exports = {
  downloadFileTo,
  downloadUrlTo
}

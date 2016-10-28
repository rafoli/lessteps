// ==============
// Tasks
// ==============

const shell = require('../helpers/shell-helper');
const log = require('../helpers/log-helper');

const async = require('async');
const prop = require('properties-parser');
const path = require("path");

const downloadFileTo = function(propertiesFile, key, toDir, cb) {
    log.title("Downloading file...");
    prop.read(propertiesFile, function(err, data) {
        if (err)
            cb(err);
        let fileUrl = data[key];
        shell.run('wget -P ' + toDir + ' -N ' + fileUrl, function() {
            let fileName = path.basename(fileUrl);
            cb(null, (toDir + '/' + fileName ));
        });
    });
}
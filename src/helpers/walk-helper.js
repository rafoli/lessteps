// ==============
// Helpers
// ==============

const _ = require('lodash');
const fs = require('fs');
const path = require('path');

const list = function(pattern) {
    let filelist = [];
    walkSync('.', filelist);

    let list = _.filter(filelist, function(o) {
        return (pattern).test(o);
    });

    return list;
}

const walkSync = function(dir, filelist) {
    var files = fs.readdirSync(dir);
    filelist = filelist || [];
    files.forEach(function(file) {
        if (fs.statSync(path.join(dir, file)).isDirectory()) {
            filelist = walkSync(path.join(dir, file), filelist);
        } else {
            filelist.push(path.join(dir, file));
        }
    });
    return filelist;
};

module.exports = {
    list
}

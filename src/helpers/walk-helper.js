// ==============
// Helpers
// ==============

const _ = require('lodash');
const fs = require('fs');
const path = require('path');

const list = function(pattern, excludes) {
  let filelist = [];
  walkSync('.', filelist, excludes);

  let list = _.filter(filelist, function(o) {
    return (pattern).test(o);
  });

  return list;
}

const walkSync = function(dir, filelist, excludes) {
  var files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach(function(file) {

    if (!excludes || (excludes && !file.includes(excludes))) {

      let innerDir = path.join(dir, file);
      if (fs.statSync(innerDir).isDirectory()) {
        filelist = walkSync(innerDir, filelist, excludes);
      } else {
        filelist.push(innerDir);
      }

    }
  });
  return filelist;
};

module.exports = {
  list
}

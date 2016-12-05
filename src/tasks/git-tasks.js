const _ = require('lodash');
const async = require('async');

const path = require('path');
const fs = require('fs');

const log = require('../helpers/log-helper');
const shell = require('../helpers/shell-helper');
const walk = require('../helpers/walk-helper');

// ==============
// Tasks
// ==============

const stats = function(cb) {

    log.title("Git status...");

    let gitProjects = walk.list(/\.git\/HEAD/g);

    gitProjects.forEach(function(project) {

        // Project info
        let gitDir = path.dirname(project);
        let projectDir = path.resolve(gitDir, '..');
        let projectName = path.basename(projectDir);

        // Git base command
        let g = `git --git-dir=${gitDir} --work-tree=${projectDir}`;

        // Shell opts
        let gOpts = { silent: true };

        async.auto({
            branch: function(cb) {
                shell.run(`${g} rev-parse --symbolic-full-name --abbrev-ref HEAD`, cb, gOpts);
            },
            local: function(cb) {
                shell.run(`${g} rev-parse @{0}`, cb, gOpts);
            },
            remote: function(cb) {
                shell.run(`${g} rev-parse @{u}`, cb, gOpts);
            },
            base: function(cb) {
                shell.run(`${g} merge-base @{0} @{u}`, cb, gOpts);
            },
            changesNotStaged: function(cb) {
                shell.run(`${g} diff`, cb, gOpts);
            },
            changesStaged: function(cb) {
                shell.run(`${g} diff --cached`, cb, gOpts);
            },
            untracked: function(cb) {
                shell.run(`${g} ls-files --exclude-standard --others`, cb, gOpts);
            },
        }, function(err, res) {
            if (err)
                console.log(err);
            else {

                let branchName = res.branch.replace(/(\r\n|\n|\r)/gm,"");
                let title = `(${branchName}) ${projectName.cyan}`;

                if (res.changesNotStaged.length > 0 || res.changesStaged.length > 0) {
                    log.dottedError(title, 'changes to commit');
                } else {
                    if (res.local == res.remote) {
                        if (res.untracked.length > 0) {
                            log.dottedError(title, 'untracked files');
                        } else
                            log.dottedInfo(title, 'ok');
                    } else if (res.local == res.base) {
                        log.dottedError(title, 'needs to be pulled');
                    } else if (res.remote == res.base) {
                        log.dottedError(title, 'needs to be pushed');
                    } else {
                        log.dottedError(title, 'diverged');
                    }
                }

                shell.run(`${g} status -s`, null, {sync:true});
            }
        });
    });
}


//shell.run(`git --git-dir=${gitDir} remote set-url origin http://bgcldevops/bgp-bel-portal/${projectName}`, function(err, res){}, {log:true});


// shell.run(`git --git-dir=${gitDir} push --set-upstream origin liferay_merge`, function(err, res) {
//     if (!err) {
//         console.log("Project: ", projectName);
//     }
// }, { silent: true });



module.exports = {
    stats
}

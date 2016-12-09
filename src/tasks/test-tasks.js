const fs = require("fs");
const log = require('../helpers/log-helper');
const path = require('path');
const shell = require('../helpers/shell-helper');
const walk = require('../helpers/walk-helper');
const cheerio = require("cheerio");
const ProgressBar = require('ascii-progress');

const unitTest = function() {
    test('unitTest');
}

const functionalTest = function() {
    test('functionalTest');
}

const sanityTest = function() {
    test('sanityTest');
}

const integrationTest = function() {
    test('integrationTest');
}

const test = function(type) {
    log.title("UnitTest...");

    let gitProjects = walk.list(/\.bnd/);

    gitProjects.forEach(function(project) {

        // Project info
        let projectDir = path.dirname(project);
        let projectName = path.basename(projectDir);

        log.info(projectDir);

        shell.run(`cd ${projectDir} && gradle ${type}`, null, { sync: true });
    });
}

const coverage = function() {

    let gitProjects = walk.list(/\.bnd/);

    let projects = [];

    gitProjects.forEach(function(project) {

        // Project info
        let projectDir = path.dirname(project);
        let projectName = path.basename(projectDir);
        let reportFile = `./${projectDir}/build/reports/jacoco/test/html/index.html`;

        //shell.run(`cd ${projectDir} && gradle clean test jacocoTestReport`, null, { sync: true });

        console.log(reportFile)

        let content;
        let value;

        try {
            content = fs.readFileSync(reportFile);
        } catch (err) {
            console.log('Not found: ', reportFile);
        }

        if (content) {
            let $ = cheerio.load(content);


            value= $('tfoot tr .ctr2').slice(0).eq(0).text().replace('%', '');

        }

        projects.push({name: projectName, value:((content && value) ? value : 0)})

    })

    projects.forEach(function(project) {
        var cyan = '\u001b[46m \u001b[0m';
        var red = '\u001b[41m \u001b[0m';

        var bar = new ProgressBar({
            schema: '|:bar.gradient(red,cyan)| :percent => :title ',
            width: 20,
            total: 100,
        });
        bar.tick(project.value, {title: project.name});
    })


}

module.exports = {
    unitTest,
    functionalTest,
    sanityTest,
    integrationTest,
    coverage
}

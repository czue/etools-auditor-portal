const spawn = require('child_process').spawn;
const argv = require('yargs').argv;
const fs = require('fs');

module.exports = function testElements(done) {
    let withErrors = false;
    let files = fs.readdirSync('./build/tests/');

    files = files.filter((src) => {
        return src.search(/index\d.spec.html/) !== -1;
    });

    runTests(files);

    function runTests() {
        let indexFileName = files.shift();

        if (!indexFileName) {
            endedWithErrors(withErrors);
            done();
            return;
        }

        let tests = spawn('npm', ['test', `./build/tests/${indexFileName}`]);

        console.log(`\x1b[32mRunning ${indexFileName}.\x1b[0m`);

        tests.stdout.on('data', (data) => {
            if (~data.indexOf('✖') || ~data.indexOf('Tests failed:')) {
                data = `\x1b[31m${data}\x1b[0m`;
                withErrors = true;
            } else if (~data.indexOf('ended with great success')) {
                data = `\x1b[32m${data}\x1b[0m`;
            }
            console.log(`${data}`);
        });

        tests.stderr.on('data', (data) => {
            console.log(`${data}`);
            withErrors = true;
            if (argv.pc) {
                endedWithErrors(withErrors);
                process.exit(1);
            }
        });

        tests.on('close', (code) => {
            runTests(files);
            done();
        });
    }

    function endedWithErrors(withErrors) {
        if (withErrors) {
            console.log(`\x1b[31mTests failed! See above for more details.\x1b[0m`);
        }
    }
};

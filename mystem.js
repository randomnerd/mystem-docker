const path = require('path');
const exec = require('child_process').execFile;
const mystemPath = process.env.MYSTEM_PATH || path.join(__dirname, 'mystem-linux');
const mystemParams = process.env.MYSTEM_PARAMS ? process.env.MYSTEM_PARAMS.split(' ') : ['-cigfn',  '--format', 'json'];
const timeout = 5 * 1000;

module.exports = function(input) {
    return new Promise((resolve, reject) => {
        const mystem = exec(mystemPath, mystemParams, { timeout }, (err, stdout, stderr) => {
            if (err) return reject({error: err.message});
            let arr = [];
            for (const line of stdout.split("\n")) {
                if (!line || !line.length) continue;
                arr.push(JSON.parse(line));
            }
            return resolve(arr);
        });
        mystem.stdin.write(input);
        mystem.stdin.end();
    });
};

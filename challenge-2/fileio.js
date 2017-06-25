const fs = require('fs');
const path = require('path');

const files = ['fileone.txt', 'filetwo.txt', 'filethree.txt'];

// Collect promises and print out
/**
 * @const {Array<Promise<String>>} Array of promises resolving to the first line
 *     in test set of files.
 */
const linePromises = files.map((file) => getFirstLinePromise(file));
Promise.all(linePromises).then((results) => {
    results.forEach((result) => console.log(result));
});

/**
 * Returns a promise that should resolve with the first line in the file.
 * @param {String} filename Name of file whose first line is desired.
 * @returns {Promise<String>} A promise resolving to the first line of the file.
 */
function getFirstLinePromise(filename) {
    return new Promise((resolve, reject) => {
        fs.readFile(getFilePath(filename), 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data.split('\n')[0]);
            }
        });
    });
}

/**
 * Returns the fully qualified path to a file with the given name located in the
 * same directory as this file.
 * @param {String} filename Name of the file whose path is desired.
 * @returns {Promise<String>} The fully qualified path to the file with the
 *     given name.
 */
function getFilePath(filename) {
    return path.resolve(__dirname, filename);
}

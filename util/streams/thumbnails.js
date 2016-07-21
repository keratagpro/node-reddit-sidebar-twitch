const fs = require("fs");
const path = require("path");
const fetch = require('node-fetch');
const mkdirp = require("mkdirp");
const rimraf = require("rimraf");
const sanitize = require('sanitize-filename');

function fetchStreamThumbnails(streams, outDir = '.') {
    return rimrafAsync(outDir)
        .then(() => mkdirpAsync(outDir))
        .then(() => Promise.all(streams.map(stream => fetchStreamThumbnail(stream, outDir))));
}

function fetchStreamThumbnail(stream, outDir) {
    return new Promise((resolve, reject) => {
        var filename = path.join(outDir, sanitize(stream.name + '.jpg'));

        var file = fs.createWriteStream(filename);
        file.on("error", err => reject(err));
        file.on("finish", () => resolve(stream));

        stream.thumbnail = filename;

        fetch(stream.thumbnail_src).then(res => {
            if (!res.ok) {
                var thumbnail_404 = path.resolve(__dirname, "../assets/404_thumbnail.jpg");
                return fs.createReadStream(thumbnail_404).pipe(file);
            }
            res.body.pipe(file);
        }).catch(() => reject(arguments));
    });
}

function rimrafAsync(files) {
    return new Promise((resolve, reject) => {
        rimraf(files, {}, function(err) {
            if (err) reject(err);
            else resolve();
        });
    });
}

function mkdirpAsync(files) {
    return new Promise((resolve, reject) => {
        mkdirp(files, {}, function(err) {
            if (err) reject(err);
            else resolve();
        });
    });
}

module.exports = {
    fetchStreamThumbnails
};

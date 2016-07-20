var fs = require("fs");
var path = require("path");
var fetch = require('node-fetch');
var mkdirp = require("mkdirp");
var rimraf = require("rimraf");

var youtube = require('./streams/youtube');
var twitch = require('./streams/twitch');

const THUMBNAIL_DIRECTORY = __dirname + "/../.tmp/thumbnails";

function fetchStreamThumbnail(stream) {
    return new Promise((resolve, reject) => {
        var filename = stream.name.replace(" ", "_").trim() + ".jpg";
        var filepath = path.join(THUMBNAIL_DIRECTORY, filename);
        var file = fs.createWriteStream(filepath);
        file.on("error", err => reject(err));
        file.on("finish", () => resolve(stream));

        stream.thumbnail = filepath;

        fetch(stream.thumbnail_src).then(res => {
            if (!res.ok) {
                var thumbnail_404 = path.resolve(__dirname, "../assets/404_thumbnail.jpg");
                return fs.createReadStream(thumbnail_404).pipe(file);
            }
            res.body.pipe(file);
        }).catch(() => reject(arguments));
    });
}

function fetchStreamsAndThumbnails({
    youtubeKey,
    youtubeQuery,
    twitchClientId,
    twitchGame,
    limit
}) {
    return Promise.all([
        youtube.fetchYoutubeStreams(youtubeQuery, youtubeKey, limit),
        twitch.fetchTwitchStreams(twitchGame, twitchClientId, limit)
    ])
        .then(([youtubeStreams, twitchStreams]) => youtubeStreams.concat(twitchStreams))
        .then(streams => {
            rimraf.sync(THUMBNAIL_DIRECTORY);
            mkdirp.sync(THUMBNAIL_DIRECTORY);
            return Promise.all(streams.map(fetchStreamThumbnail));
        });
}

module.exports = {
    fetchStreamsAndThumbnails
};

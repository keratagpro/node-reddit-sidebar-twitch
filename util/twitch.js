var fs = require("fs");
var path = require("path");
var fetch = require('node-fetch');
var mkdirp = require("mkdirp");
var rimraf = require("rimraf");

const limit = parseInt(process.env.APP_MAX_STREAMS, 10);
const TWITCH_GAME_STREAMS_URL = 'https://api.twitch.tv/kraken/streams?limit='+limit+'&game=';
const THUMBNAIL_DIRECTORY = __dirname + "/../.tmp/thumbnails";

function fetchGameStreams(game) {
    return fetch(TWITCH_GAME_STREAMS_URL + game)
        .then(res => res.json())
        .then(data => {
            return data.streams.map(stream => {
                return {
                    name: stream.channel.name,
                    status: stream.channel.status,
                    url: stream.channel.url,
                    thumbnail_src: stream.preview.medium
                }
            });
        })
}

function fetchStreamThumbnail (stream) {
    return new Promise((resolve, reject) => {
        var filename = stream.name.replace(" ", "_").trim() + ".jpg";
        var filepath = path.join(THUMBNAIL_DIRECTORY, filename);
        var file = fs.createWriteStream(filepath);
        file.on("error", err => reject(err));
        file.on("finish", () => resolve(stream));

        stream.thumbnail = filepath;

        fetch(stream.thumbnail_src).then(res => {
            if (res.status !== 200) {
                var thumbnail_404 = path.resolve(__dirname, "../assets/404_thumbnail.jpg");
                return fs.createReadStream(thumbnail_404).pipe(file);
            }
            res.body.pipe(file)
        }).catch(() => reject(arguments));

    });
}

function fetchStreams(game) {
    return fetchGameStreams(game)
        .then(streams => {
            rimraf.sync(THUMBNAIL_DIRECTORY);
            mkdirp.sync(THUMBNAIL_DIRECTORY);
            return Promise.all(streams.map(fetchStreamThumbnail));
        });
}

module.exports = {
    fetchStreams
}

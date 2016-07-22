const fetch = require('node-fetch');

const { buildUrl } = require('./utils');

const TWITCH_GAME_STREAMS_URL = 'https://api.twitch.tv/kraken/streams';

function fetchTwitchStreams(game, clientId, limit = 10) {
    var link = buildUrl(TWITCH_GAME_STREAMS_URL, {
        game: game,
        limit: limit,
        client_id: clientId
    });

    return fetch(link)
        .then(res => res.json())
        .then(data => {
            return data.streams.map(stream => {
                return {
                    name: stream.channel.name,
                    status: stream.channel.status,
                    url: stream.channel.url,
                    thumbnail_src: stream.preview.medium,
                    stream_src: "twitch",
                    viewers: stream.viewers
                };
            });
        });
}

module.exports = {
    fetchTwitchStreams
};

const fetch = require('node-fetch');
const url = require('url');

const TWITCH_GAME_STREAMS_URL = 'https://api.twitch.tv/kraken/streams';

function fetchTwitchStreams(game, clientId, limit = 10) {
    var link = url.parse(TWITCH_GAME_STREAMS_URL);
    link.query = Object.assign({}, link.query, {
        game: game,
        limit: limit,
        client_id: clientId
    });

    return fetch(link.format())
        .then(res => res.json())
        .then(data => {
            return data.streams.map(stream => {
                return {
                    name: stream.channel.name,
                    status: stream.channel.status,
                    url: stream.channel.url,
                    thumbnail_src: stream.preview.medium
                };
            });
        });
}

module.exports = {
    fetchTwitchStreams
};

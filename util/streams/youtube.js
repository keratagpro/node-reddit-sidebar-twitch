const fetch = require('node-fetch');
const url = require('url');

const YOUTUBE_GAME_STREAMS_URL = 'https://www.googleapis.com/youtube/v3/search?part=snippet&eventType=live&type=video';

function fetchYoutubeStreams(game, key, limit = 10) {
    var link = url.parse(YOUTUBE_GAME_STREAMS_URL);
    link.query = Object.assign({}, link.query, {
        q: game,
        key: key,
        maxResults: limit
    });

    return fetch(link.format())
        .then(res => res.json())
        .then(data => {
            return (data.items || []).map(item => {
                return {
                    name: item.snippet.channelTitle,
                    status: item.snippet.title,
                    url: 'https://www.youtube.com/watch?v=' + item.id.videoId,
                    thumbnail_src: item.snippet.thumbnails.medium.url
                };
            });
        });
}

module.exports = {
    fetchYoutubeStreams
};

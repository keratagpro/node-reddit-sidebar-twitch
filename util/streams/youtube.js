const fetch = require('node-fetch');
const url = require('url');

const YOUTUBE_GAME_STREAMS_URL = 'https://www.googleapis.com/youtube/v3/search?part=snippet&eventType=live&type=video';

function buildUrl(baseUrl, query) {
    var link = url.parse(baseUrl, true);
    link.query = Object.assign({}, link.query, query);
    delete link.search;
    return url.format(link);
}

function fetchYoutubeStreams(query, key, limit = 10) {
    var link = buildUrl(YOUTUBE_GAME_STREAMS_URL, {
        q: query,
        key: key,
        maxResults: limit
    });

    return fetch(link)
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

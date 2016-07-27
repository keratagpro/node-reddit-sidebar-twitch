const { fetchYoutubeStreams } = require('./streams/youtube');
const { fetchTwitchStreams } = require('./streams/twitch');
const { fetchStreamThumbnails } = require('./streams/thumbnails');
const { createSpritesheet } = require('./streams/sprites');

function fetchStreamsAndCreateSprites({
    limit,
    twitchClientId,
    twitchGame,
    twitchLimit = limit,
    youtubeKey,
    youtubeLimit = limit,
    youtubeQuery,
    spritePath,
    thumbnailDir
}) {
    return Promise.all([
        fetchTwitchStreams(twitchGame, twitchClientId, twitchLimit),
        fetchYoutubeStreams(youtubeQuery, youtubeKey, youtubeLimit)
    ])
        .then(([twitchStreams, youtubeStreams]) => twitchStreams.concat(youtubeStreams))
        .then(allStreams => allStreams.sort((a, b) => b.viewers - a.viewers))
        .then(allStreams => allStreams.slice(0, limit))
        .then(allStreams => fetchStreamThumbnails(allStreams, thumbnailDir))
        .then(allStreams => createSpritesheet(allStreams, spritePath));
}

module.exports = {
    fetchStreamsAndCreateSprites
};

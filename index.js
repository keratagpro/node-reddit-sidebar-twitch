require('dotenv').config({ silent: true });
const Entities = require("html-entities").AllHtmlEntities;
const path = require('path');

const subreddit = require('./util/subreddit');
const sidebar = require('./util/sidebar');
const { fetchStreamsAndCreateSprites } = require('./util/streams');

const entities = new Entities();

const MAX_STREAMS = parseInt(process.env.MAX_STREAMS, 10);
const SPRITESHEET_FILEPATH = path.join(__dirname, '.tmp/stream-sprites.png');
const THUMBNAIL_DIRECTORY = path.join(__dirname, ".tmp/thumbnails");

Promise.all([
    fetchStreamsAndCreateSprites({
        twitchClientId: process.env.TWITCH_CLIENT_ID,
        twitchGame: process.env.TWITCH_GAME,
        youtubeKey: process.env.YOUTUBE_KEY,
        youtubeQuery: process.env.YOUTUBE_QUERY,
        limit: MAX_STREAMS,
        spritePath: SPRITESHEET_FILEPATH,
        thumbnailDir: THUMBNAIL_DIRECTORY
    }),
    subreddit.fetchSidebar(),
    subreddit.fetchStylesheet()
]).then(([streams, wiki, stylesheet]) => {
    var slicedStreams = streams.slice(0, MAX_STREAMS);

    var streamsMarkdown = sidebar.renderStreams(slicedStreams);
    wiki.content_md = sidebar.replaceTwitch(wiki.content_md, streamsMarkdown);
    wiki.reason = `Update Twitch & Youtube Cards - ${slicedStreams.length} streamers`;

    if (!wiki.content_md) {
        console.log("Ending -- Cannot update.");
        return;
    }

    var style = {};
    style.content = entities.decode(stylesheet.content_md);
    style.reason = wiki.reason;

    return subreddit.updateSidebar(wiki)
        .then(() => subreddit.updateThumbnails(SPRITESHEET_FILEPATH))
        .then(() => subreddit.updateStylesheet(style))
        .then(() => console.log("Update complete: %s", style.reason));

}).catch(function(err) {
    console.error(err);
    process.exit(1);
});

// NOTE: For testing.
// fetchStreamsAndCreateSprites({
//     twitchClientId: process.env.TWITCH_CLIENT_ID,
//     twitchGame: process.env.TWITCH_GAME,
//     youtubeKey: process.env.YOUTUBE_KEY,
//     youtubeQuery: process.env.YOUTUBE_QUERY,
//     limit: MAX_STREAMS,
//     spritePath: SPRITESHEET_FILEPATH,
//     thumbnailDir: THUMBNAIL_DIRECTORY
// })
//     .then(streams => console.log(`Found ${streams.length} streams.`, streams))
//     .catch(err => console.error(err));

require('dotenv').config({ silent: true });
const Entities = require("html-entities").AllHtmlEntities;
const path = require('path');

const Subreddit = require('./util/subreddit');
const sidebar = require('./util/sidebar');
const { fetchStreamsAndCreateSprites } = require('./util/streams');

const MAX_STREAMS = parseInt(process.env.MAX_STREAMS, 10);
const SPRITESHEET_FILEPATH = path.join(__dirname, '.tmp/stream-sprites.png');
const THUMBNAIL_DIRECTORY = path.join(__dirname, ".tmp/thumbnails");

const entities = new Entities();
const subreddit = new Subreddit({
    subreddit: process.env.REDDIT_SUBREDDIT,
    key: process.env.REDDIT_KEY,
    secret: process.env.REDDIT_SECRET,
    username: process.env.REDDIT_USERNAME,
    password: process.env.REDDIT_PASSWORD
});

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
    var streamsMarkdown = sidebar.renderStreams(streams);
    wiki.content_md = sidebar.replaceStreams(wiki.content_md, streamsMarkdown);
    wiki.reason = `Update Twitch & Youtube Cards - ${streams.length} streamers`;

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

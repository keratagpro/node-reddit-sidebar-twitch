require('dotenv').config({silent: true});

var subreddit = require('./util/subreddit');
var twitch = require('./util/twitch');
var sidebar = require('./util/sidebar');
var sprites = require("./util/sprites");

function fetchStreamsAndCreateSprites () {
    return twitch.fetchGameStreams(process.env.APP_TWITCH_GAME)
        .then(sprites.createSpritesheet);
}

Promise.all([
    fetchStreamsAndCreateSprites(),
    subreddit.fetchSidebar(),
    subreddit.fetchStylesheet()
]).then(function(results) {
    var streams = results[0];
    var wiki = results[1];
    var stylesheet = results[2];

    var maxStreams = parseInt(process.env.APP_MAX_STREAMS, 10)
    var slicedStreams = streams.slice(0, maxStreams);

    var streamsMarkdown = sidebar.renderStreams(slicedStreams);
    wiki.content_md = sidebar.replaceTwitch(wiki.content_md, streamsMarkdown);
    wiki.reason = `Update Twitch Cards - ${slicedStreams.length} streamers`;

    if (!wiki.content_md) {
        console.log("Ending -- Cannot update.");
        return;
    }

    var style = {};
    style.content = stylesheet.content_md.replace(/&gt;/g, ">");
    style.reason = wiki.reason;

    return subreddit.updateSidebar(wiki)
            .then(() => subreddit.updateThumbnails())
            .then(() => subreddit.updateStylesheet(style))
            .then(() => console.log("Update complete: %s", style.reason));

}).catch(function() {
    console.log(arguments);
    process.exit(1);
});

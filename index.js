require('dotenv').load();

var subreddit = require('./util/subreddit');
var twitch = require('./util/twitch');
var sidebar = require('./util/sidebar');
var sprites = require("./util/sprites");

Promise.all([
    twitch.fetchGameStreams(process.env.APP_TWITCH_GAME),
    subreddit.fetchSidebar(),
    subreddit.fetchStylesheet(),
]).then(function(results) {
    var streams = results[0];
    var sidebar = results[1];
    var style = results[2];

    var p = sprites.createSpritesheet(streams)
        .then((streams) => {
            return {
                streams: streams,
                sidebar: sidebar,
                style: style
            }
        })

    return p;
}).then(function(results) {
    var streams = results.streams;
    var wiki = results.sidebar;
    var stylesheet = results.style

    var maxStreams = parseInt(process.env.APP_MAX_STREAMS, 10)
    var slicedStreams = streams.slice(0, maxStreams);

    var streamsMarkdown = sidebar.renderStreams(slicedStreams);
    wiki.content_md = sidebar.replaceTwitch(wiki.content_md, streamsMarkdown);
    wiki.reason = `Update Twitch Cards - ${slicedStreams.length} streamers`;

    var style = {};
    style.content = stylesheet;
    style.reason = wiki.reason;

    return subreddit.updateSidebar(wiki)
            .then(subreddit.updateThumbnails())
            .then(subreddit.updateStylesheet(style));
}).catch(function() {
    console.log(arguments);
});

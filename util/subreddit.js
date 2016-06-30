var Snoocore = require('snoocore');
var fs = require("fs");

const SPRITESHEET_FILEPATH = __dirname+"/../.tmp/twitch-sprites.png";
const SUBREDDIT_IMAGE_NAME = "stream-cards";

var reddit = new Snoocore({
    userAgent: '/u/ylambda sidebar-twitch@0.0.1',
    oauth: {
        type: 'script',
        key: process.env.APP_KEY,
        secret: process.env.APP_SECRET,
        username: process.env.APP_USERNAME,
        password: process.env.APP_PASSWORD,
        scope: ['modconfig', 'wikiedit', 'wikiread', 'modwiki']
    }
});

function fetchSidebar() {
    var subreddit = process.env.APP_SUBREDDIT;
    return reddit(`/r/${subreddit}/wiki/config/sidebar`).get()
        .then(res => res.data);
}

function fetchStylesheet() {
    var subreddit = process.env.APP_SUBREDDIT;
    return reddit(`/r/${subreddit}/stylesheet`).get()
        .then(res => res);
}

function updateSidebar(wiki) {
    var subreddit = process.env.APP_SUBREDDIT;
    var data = {
        content: wiki.content_md,
        page: "config/sidebar",
        reason: wiki.reason
    }

    return reddit(`r/${subreddit}/api/wiki/edit`).post(data);
}

function updateThumbnails() {
    var subreddit = process.env.APP_SUBREDDIT;
    var file = fs.readFileSync(SPRITESHEET_FILEPATH);
    var data = {
        file: Snoocore.file('twitch-sprites.png', 'image/png', file),
        img_type: "png",
        name: SUBREDDIT_IMAGE_NAME,
        header: 0,
        upload_type: "img"
    }

    return reddit(`r/${subreddit}/api/upload_sr_img`).post(data)
}

function updateStylesheet(style) {
    var subreddit = process.env.APP_SUBREDDIT;
    var data = {
        stylesheet_contents: style.content,
        op: "save",
        reason: style.reason
    }

    return reddit(`r/${subreddit}/api/subreddit_stylesheet`).post(data);
}


module.exports = {
    fetchSidebar,
    fetchStylesheet,
    updateSidebar,
    updateThumbnails,
    updateStylesheet
};

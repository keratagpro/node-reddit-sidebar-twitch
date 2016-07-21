var Snoocore = require('snoocore');
var fs = require("fs");

const SUBREDDIT_IMAGE_NAME = "stream-cards";

var reddit = new Snoocore({
    userAgent: '/u/ylambda sidebar-streams@0.0.1',
    oauth: {
        type: 'script',
        key: process.env.REDDIT_KEY,
        secret: process.env.REDDIT_SECRET,
        username: process.env.REDDIT_USERNAME,
        password: process.env.REDDIT_PASSWORD,
        scope: ['modconfig', 'wikiedit', 'wikiread', 'modwiki']
    }
});

function fetchSidebar(subreddit = process.env.REDDIT_SUBREDDIT) {
    return reddit(`/r/${subreddit}/wiki/config/sidebar`).get()
        .then(res => res.data);
}

function fetchStylesheet(subreddit = process.env.REDDIT_SUBREDDIT) {
    return reddit(`/r/${subreddit}/wiki/config/stylesheet`).get()
        .then(res => res.data);
}

function updateSidebar(wiki, subreddit = process.env.REDDIT_SUBREDDIT) {
    var data = {
        content: wiki.content_md,
        page: "config/sidebar",
        reason: wiki.reason
    };

    return reddit(`r/${subreddit}/api/wiki/edit`).post(data);
}

function updateThumbnails(spritePath, subreddit = process.env.REDDIT_SUBREDDIT) {
    var file = fs.readFileSync(spritePath);
    var data = {
        file: Snoocore.file('stream-sprites.png', 'image/png', file),
        img_type: "png",
        name: SUBREDDIT_IMAGE_NAME,
        header: 0,
        upload_type: "img"
    };

    return reddit(`r/${subreddit}/api/upload_sr_img`).post(data);
}

function updateStylesheet(style, subreddit = process.env.REDDIT_SUBREDDIT) {
    var data = {
        content: style.content,
        page: "config/stylesheet",
        reason: style.reason
    };

    return reddit(`r/${subreddit}/api/wiki/edit`).post(data);
}


module.exports = {
    fetchSidebar,
    fetchStylesheet,
    updateSidebar,
    updateThumbnails,
    updateStylesheet
};

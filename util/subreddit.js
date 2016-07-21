const Snoocore = require('snoocore');
const fs = require('fs');

const SUBREDDIT_IMAGE_NAME = 'stream-cards';

class Subreddit {
    constructor({
        subreddit,
        key,
        secret,
        username,
        password,
        userAgent = '/u/ylambda sidebar-streams@0.0.1'
    }) {
        this.subreddit = subreddit;
        this.reddit = new Snoocore({
            userAgent,
            oauth: {
                type: 'script',
                key,
                secret,
                username,
                password,
                scope: ['modconfig', 'wikiedit', 'wikiread', 'modwiki']
            }
        });
    }

    fetchSidebar() {
        return this.reddit(`/r/${this.subreddit}/wiki/config/sidebar`).get()
            .then(res => res.data);
    }

    fetchStylesheet() {
        return this.reddit(`/r/${this.subreddit}/wiki/config/stylesheet`).get()
            .then(res => res.data);
    }

    updateSidebar(wiki) {
        var data = {
            content: wiki.content_md,
            page: "config/sidebar",
            reason: wiki.reason
        };

        return this.reddit(`r/${this.subreddit}/api/wiki/edit`).post(data);
    }

    updateThumbnails(spritePath, imageName = SUBREDDIT_IMAGE_NAME) {
        var file = fs.readFileSync(spritePath);
        var data = {
            file: Snoocore.file('stream-sprites.png', 'image/png', file),
            img_type: "png",
            name: imageName,
            header: 0,
            upload_type: "img"
        };

        return this.reddit(`r/${this.subreddit}/api/upload_sr_img`).post(data);
    }

    updateStylesheet(style) {
        var data = {
            content: style.content,
            page: "config/stylesheet",
            reason: style.reason
        };

        return this.reddit(`r/${this.subreddit}/api/wiki/edit`).post(data);
    }

}

module.exports = Subreddit;

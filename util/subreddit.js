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

    fetchBotConfig() {
        return this.reddit(`/r/${this.subreddit}/wiki/streams/streambot`).get()
            .then(res => res.data)
            .then(this.parseBotConfig)
            .catch((err) => {
                console.log("Errors with bot config.");
                return {
                    blacklisted_streams: []
                };
            });
    }

    parseBotConfig(data) {
        var content = data.content_md;
        var configCursor = 0;
        var config = {};

        /* Search the wiki page for lists of config options.
         * A list has a name, list header, and list values
         * An example format of a list is:
         *
         * ## Config List Name
         *
         * ListHeader1 | ListHeader2 | ListHeader..
         * - | - | -
         * a | b | c
         * x | y | z
         */

        var listNameSearch = '## ';
        var listNameStart = content.indexOf(listNameSearch, configCursor);

        while (listNameStart !== -1) {
            var listNameEnd = content.indexOf('\r\n\r\n', listNameStart);
            var listName = content.slice(listNameStart + listNameSearch.length, listNameEnd);
            var option = listName.toLowerCase().trim().replace(' ', '_');

            config[option] = [];

            var listHeaderStart = listNameEnd + 4;
            var listHeaderEnd = content.indexOf('\r\n', listHeaderStart);
            var listHeaders = content.slice(listHeaderStart, listHeaderEnd).trim();

            listHeaders = listHeaders.split('|')
                .map(header => header.toLowerCase().trim().replace(' ', '_'));

            configCursor = listHeaderEnd + 2;

            var lines = content.slice(configCursor).split('\r\n');
            lines.some((line, index) => {
                var values = line.split("|");
                configCursor += line.length;

                // discard the table alignment
                if (index === 0) {
                    return;
                }

                if (values.length === 0 || values.length !== listHeaders.length) {
                    return true;
                }

                var listValue = {}
                values.forEach((value, i) => {
                    var key = listHeaders[i];
                    listValue[key] = value;
                });

                config[option].push(listValue);
            });

            listNameStart = content.indexOf(listNameSearch, configCursor);
        }

        return config;
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

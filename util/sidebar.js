var _ = require('lodash');
var fs = require('fs');

const SIDEBAR_TWITCH_HEADER = '- **Live** *streams*';
const SIDEBAR_TWITCH_FOOTER = '- [**.** *see more »*]';

function renderStreams(streams) {
    var tpl = fs.readFileSync('./streams.md.tpl', 'utf8');
    var template = _.template(tpl);

    if (streams.length === 0 ) {
        return "";
    }

    return template({
        streams: streams.map(stream => `* [**${stream.status}** *${stream.name}*](${stream.url})`).join('\n')
    });
}

function replaceContent(content, replacement, header, footer) {
    var start = content.indexOf(header);

    if (start === -1) {
        console.log('Header not found: ' + header);
        return;
    }

    start = start + header.length;

    var end = content.indexOf(footer, start);

    var minimumReplacement = 8;
    var hasNewStreamers = replacement.length > minimumReplacement;
    var hasOldStreamers = (end - start !== 1);
    if (!hasNewStreamers && !hasOldStreamers) {
        console.log("0 new streamers, 0 old streamers");
        return;
    }

    if (end === -1) {
        console.log('Footer not found: ' + footer);
        return;
    }

    return content.substring(0, start) +
        '\n' + replacement +
        content.substring(end);
}

function replaceTwitch(content, replacement) {
    return replaceContent(
        content,
        replacement,
        SIDEBAR_TWITCH_HEADER,
        SIDEBAR_TWITCH_FOOTER);
}

module.exports = {
    renderStreams,
    replaceContent,
    replaceTwitch
}

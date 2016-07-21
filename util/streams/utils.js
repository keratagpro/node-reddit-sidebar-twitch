const url = require('url');

function buildUrl(baseUrl, query) {
    var link = url.parse(baseUrl, true);
    link.query = Object.assign({}, link.query, query);
    delete link.search;
    return url.format(link);
}

module.exports = {
    buildUrl
};

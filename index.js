require('dotenv').load();

var subreddit = require('./util/subreddit');
var twitch = require('./util/twitch');
var sidebar = require('./util/sidebar');

Promise.all([
	twitch.fetchGameStreams(process.env.APP_TWITCH_GAME),
	subreddit.fetchSettings(process.env.APP_SUBREDDIT)
]).then(function(results) {
	var streams = results[0];
	var settings = results[1];

	var maxStreams = parseInt(process.env.APP_MAX_STREAMS, 10);
	var streamsMarkdown = sidebar.renderStreams(streams.slice(0, maxStreams));

	settings.description = sidebar.replaceTwitch(settings.description, streamsMarkdown);

	subreddit.updateSettings(settings);
}).catch(function() {
	console.log(arguments);
});

// function test() {
// 	subreddit.getSettings(process.env.APP_SUBREDDIT).then(data => {
// 		var streams = sidebar.renderStreams(['aaa', 'bbb']);
// 		console.log('before: ' + data.description);
// 		data.description = sidebar.replaceTwitch(data.description, streams);
// 		console.log('after: ' + data.description);
// 	});
// }
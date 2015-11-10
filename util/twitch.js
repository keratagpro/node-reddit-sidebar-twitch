var fetch = require('node-fetch');

const TWITCH_GAME_STREAMS_URL = 'https://api.twitch.tv/kraken/streams?game=';

function fetchGameStreams(game) {
	return fetch(TWITCH_GAME_STREAMS_URL + game)
		.then(res => res.json())
		.then(data => {
			return data.streams.map(stream => {
				return {
					name: stream.channel.name,
					url: stream.channel.url
				}
			});
		});
}

module.exports = {
	fetchGameStreams
}
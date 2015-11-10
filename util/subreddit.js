var Snoocore = require('snoocore');

var reddit = new Snoocore({
	userAgent: '/u/laevus sidebar-twitch@0.0.1',
	oauth: {
		type: 'script',
		key: process.env.APP_KEY,
		secret: process.env.APP_SECRET,
		username: process.env.APP_USERNAME,
		password: process.env.APP_PASSWORD,
		scope: ['modconfig']
	}
});

function fetchSettings(subreddit) {
	return reddit(`/r/${subreddit}/about/edit`).get()
		.then(res => res.data);
}

function fetchDescription(subreddit) {
	return fetchSettings().then(sidebar => sidebar.description);
}

function updateSettings(data) {
	if (!data.sr) {
		data.sr = data.subreddit_id;
	}

	if (!data.link_type) {
		data.link_type = data.content_options;
	}

	if (!data.type) {
		data.type = data.subreddit_type;
	}

	return reddit('/api/site_admin').post(data);
}

module.exports = {
	fetchSettings,
	fetchDescription,
	updateSettings
};
# Reddit Sidebar Twitch Widget

Simple NodeJS project that can add Twitch streams of a specific game to a subreddit's sidebar.

## Usage

0. Run `npm install` to install dependencies.

1. Add this header and footer to the sidebar:

		[](#hidden-twitch-streams-start)
		[](#hidden-twitch-streams-end)

2. Rename `.env.example` to `.env` and change as necessary:

		APP_KEY=<Your app ID>
		APP_SECRET=<Your app secret>
		APP_USERNAME=<reddit password>
		APP_PASSWORD=<reddit password>
		APP_SUBREDDIT=<subreddit name, e.g. tagpro>
		APP_TWITCH_GAME=TagPro
		APP_MAX_STREAMS=<max number of streams>

3. Change `streams.md.tpl` to suit your needs.

4. Run with `node index.js`
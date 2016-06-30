# Reddit Sidebar Twitch Widget

Simple NodeJS project that can add Twitch streams of a specific game to a subreddit's sidebar.

This is a fork of [Kera's Twitch Stream Bot](https://github.com/keratagpro/node-reddit-sidebar-twitch) which adds thumbnail sprites.

## Usage

0. Run `npm install` to install dependencies.

1. Rename `.env.example` to `.env` and change as necessary:

        APP_KEY=<Your app ID>
        APP_SECRET=<Your app secret>
        APP_USERNAME=<reddit password>
        APP_PASSWORD=<reddit password>
        APP_SUBREDDIT=<subreddit name, e.g. tagpro>
        APP_TWITCH_GAME=TagPro
        APP_MAX_STREAMS=<max number of streams>

2. Run with `node index.js`

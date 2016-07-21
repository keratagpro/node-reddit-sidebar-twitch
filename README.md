# Reddit Sidebar Game Streams

Simple NodeJS project that can add Twitch & YouTube streams of a specific game to a subreddit's sidebar.
A spritesheet of stream thumbnails is also created.

## Usage

0. Run `npm install` to install dependencies.

1. Rename `.env.example` to `.env` and change as necessary:

        REDDIT_KEY=<Your app ID>
        REDDIT_SECRET=<Your app secret>
        REDDIT_USERNAME=<reddit password>
        REDDIT_PASSWORD=<reddit password>
        REDDIT_SUBREDDIT=<subreddit name, e.g. tagpro>
        TWITCH_CLIENT_ID=<Your Twitch app ID>
        TWITCH_GAME=TagPro
        YOUTUBE_KEY=<Your YouTube Data API Key>
        YOUTUBE_QUERY=TagPro
        MAX_STREAMS=<max number of streams>

2. Run with `npm start` (or `node index.js`).

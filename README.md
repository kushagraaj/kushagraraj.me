# kushagraraj.me — v3

My personal site. Built with Next.js 15, React 19 and Tailwind CSS 4.

- now playing from Last.fm (links out to Spotify)
- last visitor's city in the footer
- GitHub contribution grid on hover
- five time-of-day themes that follow the visitor's local clock
- blog posts written in markdown (`content/blog`)

## running it

```bash
npm install
cp .env.example .env.local   # add your keys
npm run dev
```

Content (name, intro, projects, links) lives in `lib/site.ts`.

## env

| variable | used for |
| --- | --- |
| `LASTFM_USERNAME`, `LASTFM_API_KEY` | now playing |
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | last visitor (falls back to a local file without them) |
| `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET` | optional, exact Spotify track links |

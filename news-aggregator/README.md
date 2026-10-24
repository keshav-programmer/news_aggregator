# Pressly

A news aggregator with a React frontend and an Express API that combines several sources: RSS feeds from The Hindu and the BBC, plus (optionally) [NewsAPI](https://newsapi.org). Browse India and world headlines by section, search, bookmark stories, and switch between dark and light themes.

## Features

- Eight sections: All News (India and world merged), India, World, Technology, Business, Science, Sports, Entertainment
- Multiple sources merged, de-duplicated and sorted newest first; one failing source never breaks the page
- Search within the current section (debounced)
- "Load more" pagination
- Bookmarks saved in your browser (they persist across refreshes)
- Loading skeletons, error states with retry, image fallbacks, relative timestamps
- Dark and light themes

## Getting started

You need Node.js 22 or newer. A NewsAPI key is optional: without one, the app runs on RSS feeds alone.

```bash
# 1. install both the frontend and the server
npm run install:all

# 2. add your API key
cp server/.env.example server/.env
#    optionally edit server/.env and set NEWS_API_KEY

# 3. run frontend (http://localhost:5173) and API (http://localhost:5000) together
npm run dev:all
```

In development Vite proxies `/api` to the Express server, so no CORS setup is needed.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev:all` | Frontend and API together |
| `npm run dev` / `npm run dev:server` | Either one on its own |
| `npm run build` | Production frontend build into `dist/` |
| `npm run lint` | ESLint for frontend and server |
| `npm test` | Frontend utility tests and server tests (`node --test`, no extra deps) |
| `npm --prefix server run check:feeds` | Live-checks every RSS feed from your machine and reports which work |

## API

### `GET /api/news`

| Param | Default | Notes |
| --- | --- | --- |
| `section` | `all` | `all`, `india`, `world`, `technology`, `business`, `science`, `sports`, `entertainment` |
| `q` | none | Search text, up to 100 characters |
| `page` | `1` | 1 to 10, 20 stories per page |

```json
{
  "articles": [
    {
      "id": "https://…", "title": "…", "description": "…", "source": "…",
      "publishedAt": "2026-10-20T08:00:00Z", "image": "https://… or null",
      "url": "https://…", "category": "India", "region": "INDIA"
    }
  ],
  "page": 1,
  "totalResults": 38,
  "hasMore": true
}
```

Errors return `{ "message": "…" }` with `400` (bad input), `429` (rate limited), `502` (provider error) or `504` (provider timeout). Provider error details are logged on the server and never sent to the browser.

### `GET /api/health`

Returns `{ "status": "ok" }`.

## Configuration (`server/.env`)

| Variable | Default | Purpose |
| --- | --- | --- |
| `NEWS_API_KEY` | optional | Adds NewsAPI as an extra source; RSS-only without it |
| `PORT` | `5000` | API port |
| `CORS_ORIGIN` | `http://localhost:5173` | Comma separated list of allowed frontend origins |
| `CACHE_TTL_SECONDS` | `600` | How long NewsAPI responses are cached |
| `RSS_CACHE_TTL_SECONDS` | `300` | How long each RSS feed is cached |
| `UPSTREAM_TIMEOUT_MS` | `8000` | Timeout for each outgoing request |
| `RATE_LIMIT_PER_MINUTE` | `60` | Per-IP limit on `/api` |

For a separately hosted API, build the frontend with `VITE_API_URL=https://your-api.example.com`.

## Sources

| Source | Used for |
| --- | --- |
| The Hindu RSS | India, world, business, science, technology, sport, entertainment |
| BBC News and BBC Sport RSS | India, world and every other section |
| NewsAPI (optional) | World top headlines, plus search restricted to Indian outlets (Times of India, NDTV, Hindustan Times, Indian Express, Mint, News18) |

All RSS feed URLs live in `server/sources/feeds.js`, and the section-to-source mapping is in `server/services/newsService.js`. To add an outlet, add its feed to `feeds.js`, reference it from a section, then run `npm --prefix server run check:feeds`.

**Terms of use.** RSS feeds come with conditions. Pressly shows each story's headline and short summary, credits the outlet, and links to the original. The BBC allows feeds on personal sites on those terms. The Times of India forbids aggregating its RSS without consent, so it is deliberately not included. Check each outlet's terms before adding it, and before deploying publicly.

## How it works

- **Merging.** For each request, every source for that section is queried in parallel. Results are sorted newest first, and duplicates are dropped by canonical link and by normalised headline, which catches the same story from two outlets.
- **Resilience.** A failing source is skipped and logged. If every source fails you get a generic 502/504 (details stay in the server log). A feed cached earlier is served stale rather than erroring.
- **Caching.** Each RSS feed and each NewsAPI query is cached in memory, and identical concurrent requests share one download.
- **Cleaning.** Removed or untitled articles, non-http(s) links and broken images are dropped. Summaries are stripped of HTML and trimmed.
- **Race safety.** The frontend cancels in-flight requests when you switch sections quickly.

## Project layout

```
server/
  index.js                 starts the server
  app.js                   Express app (helmet, CORS, rate limit, errors)
  config.js                environment handling
  routes/news.js           GET /api/news
  services/newsService.js  aggregator: sections, merge, de-duplicate, paginate
  sources/                 feeds.js (RSS list), rssSource.js, newsApiSource.js, article.js
  scripts/checkFeeds.js    live feed checker
  test/                    server tests
src/
  api/ constants/ hooks/ utils/ components/
```

## Notes

NewsAPI's free developer plan is intended for development and testing. Check their terms, and each RSS outlet's terms, before deploying publicly.

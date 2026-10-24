import { config } from './config.js'
import { createApp } from './app.js'
import { createNewsService } from './services/newsService.js'
import { createRssSource } from './sources/rssSource.js'
import { createNewsApiSource } from './sources/newsApiSource.js'

const rssSource = createRssSource({
  ttlMs: config.rssCacheTtlSeconds * 1000,
  timeoutMs: config.upstreamTimeoutMs,
})

// NewsAPI is optional: without a key the app runs on RSS feeds alone.
let newsApiSource = null
if (config.newsApiKey) {
  newsApiSource = createNewsApiSource({
    apiKey: config.newsApiKey,
    apiUrl: config.newsApiUrl,
    ttlMs: config.cacheTtlSeconds * 1000,
    timeoutMs: config.upstreamTimeoutMs,
  })
} else {
  console.warn('NEWS_API_KEY not set: running on RSS feeds only (no NewsAPI).')
}

const app = createApp({
  newsService: createNewsService({ rssSource, newsApiSource }),
  corsOrigins: config.corsOrigins,
  rateLimitPerMinute: config.rateLimitPerMinute,
})

app.listen(config.port, () => {
  console.log(`Pressly server running on port ${config.port}`)
})

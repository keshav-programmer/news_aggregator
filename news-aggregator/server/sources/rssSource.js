import Parser from 'rss-parser'
import { FEEDS } from './feeds.js'
import { NewsServiceError } from '../errors.js'
import { isHttpUrl, makeArticle } from './article.js'

const parser = new Parser({
  customFields: {
    item: [
      ['media:thumbnail', 'mediaThumbnail'],
      ['media:content', 'mediaContent'],
    ],
  },
})

// Clients only ever see a generic message; the real reason goes to the log.
function feedError(status, key, detail) {
  const error = new NewsServiceError(status, 'A news source is unavailable right now')
  error.detail = `${key}: ${detail}`
  return error
}

const USER_AGENT = 'PresslyBot/1.0 (news aggregator learning project)'

function pickImage(item) {
  const candidates = [
    item.enclosure?.type?.startsWith('image') ? item.enclosure.url : null,
    item.mediaThumbnail?.$?.url,
    item.mediaContent?.$?.url,
    // Last resort: first <img> inside the item's HTML.
    /<img[^>]+src=["']([^"']+)["']/i.exec(item['content:encoded'] || item.content || '')?.[1],
  ]
  return candidates.find(isHttpUrl) || null
}

function summarize(item) {
  const text = (item.contentSnippet || item.summary || '').replace(/\s+/g, ' ').trim()
  if (text.length <= 280) return text
  return `${text.slice(0, 277).trimEnd()}…`
}

export function createRssSource({
  feeds = FEEDS,
  fetchImpl = fetch,
  ttlMs = 5 * 60 * 1000,
  timeoutMs = 8000,
  now = () => Date.now(),
  logger = console,
} = {}) {
  const cache = new Map() // feed key -> { articles, expires }
  const inflight = new Map()

  async function download(key) {
    const feed = feeds[key]
    let response
    try {
      response = await fetchImpl(feed.url, {
        headers: { 'User-Agent': USER_AGENT, Accept: 'application/rss+xml, application/xml, text/xml' },
        signal: AbortSignal.timeout(timeoutMs),
      })
    } catch (error) {
      const timedOut = error.name === 'TimeoutError' || error.name === 'AbortError'
      throw feedError(timedOut ? 504 : 502, key, timedOut ? 'timed out' : error.message)
    }
    if (!response.ok) throw feedError(502, key, `HTTP ${response.status}`)

    let parsed
    try {
      parsed = await parser.parseString(await response.text())
    } catch (error) {
      throw feedError(502, key, `invalid feed (${error.message})`)
    }

    return parsed.items
      .filter((item) => item.title && isHttpUrl(item.link))
      .map((item) =>
        makeArticle({
          title: item.title,
          description: summarize(item),
          url: item.link,
          image: pickImage(item),
          publishedAt: item.isoDate || null,
          source: feed.name,
          region: feed.region,
          category: feed.topic,
        })
      )
      .filter((article) => article.title !== '')
  }

  async function getFeed(key) {
    if (!feeds[key]) throw new Error(`Unknown feed: ${key}`)

    const hit = cache.get(key)
    if (hit && hit.expires > now()) return hit.articles

    if (!inflight.has(key)) {
      const request = download(key)
        .then((articles) => {
          cache.set(key, { articles, expires: now() + ttlMs })
          return articles
        })
        .finally(() => inflight.delete(key))
      inflight.set(key, request)
    }

    try {
      return await inflight.get(key)
    } catch (error) {
      // A feed that is down right now still has yesterday's headlines worth showing.
      if (hit) {
        logger.warn(`Using stale copy of ${key}: ${error.detail ?? error.message}`)
        return hit.articles
      }
      throw error
    }
  }

  // One broken feed must never break the page, so failures are collected, not thrown.
  async function getFeeds(keys) {
    const results = await Promise.allSettled(keys.map(getFeed))
    const articles = []
    const failures = []
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') articles.push(...result.value)
      else failures.push({ source: keys[index], error: result.reason })
    })
    return { articles, failures }
  }

  return { getFeeds, getFeed }
}

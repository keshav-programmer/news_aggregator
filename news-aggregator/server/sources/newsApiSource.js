import { NewsServiceError } from '../errors.js'
import { isHttpUrl, makeArticle } from './article.js'

const DEFAULT_API_URL = 'https://newsapi.org/v2/top-headlines'
// One request per section is enough now that RSS adds depth, and it spares
// the free plan's ~100 requests/day.
const PAGE_SIZE = 50

// NewsAPI keeps deleted stories around as "[Removed]" placeholders.
function isUsable(raw) {
  return Boolean(
    raw &&
      isHttpUrl(raw.url) &&
      raw.title &&
      raw.title !== '[Removed]' &&
      !raw.url.includes('removed.com')
  )
}

export function createNewsApiSource({
  apiKey,
  apiUrl = DEFAULT_API_URL,
  fetchImpl = fetch,
  ttlMs = 10 * 60 * 1000,
  timeoutMs = 8000,
  now = () => Date.now(),
  logger = console,
} = {}) {
  const cache = new Map()
  const inflight = new Map()

  function buildUrl(feed, q) {
    // 'everything' is a sibling of 'top-headlines' (.../v2/everything).
    const isEverything = feed.endpoint === 'everything'
    const url = isEverything ? new URL('everything', apiUrl) : new URL(apiUrl)
    url.searchParams.set('pageSize', String(PAGE_SIZE))

    if (isEverything) {
      url.searchParams.set('domains', feed.domains.join(','))
      url.searchParams.set('language', 'en')
      url.searchParams.set('sortBy', 'publishedAt')
    } else {
      url.searchParams.set('country', feed.country)
      url.searchParams.set('category', feed.category)
    }
    if (q) url.searchParams.set('q', q)
    return url
  }

  async function download(feed, q) {
    let response
    try {
      response = await fetchImpl(buildUrl(feed, q), {
        headers: { 'X-Api-Key': apiKey },
        signal: AbortSignal.timeout(timeoutMs),
      })
    } catch (error) {
      if (error.name === 'TimeoutError' || error.name === 'AbortError') {
        throw new NewsServiceError(504, 'The news provider took too long to respond')
      }
      logger.error('NewsAPI network error:', error.message)
      throw new NewsServiceError(502, 'Unable to reach the news provider')
    }

    const data = await response.json().catch(() => null)

    if (!response.ok || !data || !Array.isArray(data.articles)) {
      // Log the real reason, but never forward provider messages to clients.
      logger.error('NewsAPI error:', response.status, data?.code, data?.message)
      if (response.status === 429) {
        throw new NewsServiceError(429, 'News provider rate limit reached. Please try again later')
      }
      throw new NewsServiceError(502, 'The news provider returned an error')
    }

    return data.articles.filter(isUsable).map((raw) =>
      makeArticle({
        title: raw.title,
        description: raw.description,
        url: raw.url,
        image: raw.urlToImage,
        publishedAt: raw.publishedAt,
        source: raw.source?.name,
        region: feed.region,
        category: feed.topic,
      })
    )
  }

  async function getArticles(feed, q = '') {
    const key = JSON.stringify([feed, q.toLowerCase()])
    const hit = cache.get(key)
    if (hit && hit.expires > now()) return hit.articles

    if (!inflight.has(key)) {
      const request = download(feed, q)
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
      if (hit) {
        logger.warn(`Using stale NewsAPI copy: ${error.message}`)
        return hit.articles
      }
      throw error
    }
  }

  return { getArticles }
}

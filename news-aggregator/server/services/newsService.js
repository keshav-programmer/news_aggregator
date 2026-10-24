// The aggregator: asks every source for a section, merges the results,
// removes duplicates and sorts newest first.
import { NewsServiceError } from '../errors.js'
import { titleKey } from '../sources/article.js'

export { NewsServiceError }

export const PAGE_SIZE = 20
export const MAX_PAGE = 10

// NewsAPI's own "country=in" headlines are sparse, so Indian news is pulled
// from the search endpoint, limited to well-known Indian outlets.
const INDIA_API = {
  endpoint: 'everything',
  region: 'INDIA',
  topic: 'India',
  domains: [
    'timesofindia.indiatimes.com',
    'thehindu.com',
    'ndtv.com',
    'hindustantimes.com',
    'indianexpress.com',
    'livemint.com',
    'news18.com',
  ],
}
const WORLD_API = { country: 'us', category: 'general', region: 'WORLD', topic: 'World' }
const topicApi = (category, topic) => ({ country: 'us', category, region: 'WORLD', topic })

export const SECTIONS = {
  all: {
    label: 'All News',
    api: [INDIA_API, WORLD_API],
    rss: ['hindu-india', 'bbc-india', 'hindu-world', 'bbc-world'],
  },
  india: { label: 'India', api: [INDIA_API], rss: ['hindu-india', 'bbc-india'] },
  world: { label: 'World', api: [WORLD_API], rss: ['hindu-world', 'bbc-world'] },
  technology: {
    label: 'Technology',
    api: [topicApi('technology', 'Technology')],
    rss: ['hindu-technology', 'bbc-technology'],
  },
  business: {
    label: 'Business',
    api: [topicApi('business', 'Business')],
    rss: ['hindu-business', 'bbc-business'],
  },
  science: {
    label: 'Science',
    api: [topicApi('science', 'Science')],
    rss: ['hindu-science', 'bbc-science'],
  },
  sports: {
    label: 'Sports',
    api: [topicApi('sports', 'Sports')],
    rss: ['hindu-sport', 'bbc-sport'],
  },
  entertainment: {
    label: 'Entertainment',
    api: [topicApi('entertainment', 'Entertainment')],
    rss: ['hindu-entertainment', 'bbc-entertainment'],
  },
}

// RSS has no server-side search, so match the query words ourselves.
function matchesQuery(article, q) {
  const text = `${article.title} ${article.description}`.toLowerCase()
  return q
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((word) => text.includes(word))
}

export function createNewsService({ rssSource, newsApiSource = null, logger = console } = {}) {
  async function collect(section, q) {
    const { api, rss } = SECTIONS[section]
    const jobs = []

    if (newsApiSource) {
      for (const feed of api) {
        jobs.push(
          newsApiSource
            .getArticles(feed, q)
            .then((articles) => ({ articles, failures: [] }))
            .catch((error) => ({ articles: [], failures: [{ source: `newsapi:${feed.topic}`, error }] }))
        )
      }
    }
    jobs.push(
      rssSource.getFeeds(rss).then((result) => ({
        articles: q ? result.articles.filter((article) => matchesQuery(article, q)) : result.articles,
        failures: result.failures,
      }))
    )

    const results = await Promise.all(jobs)
    const failures = results.flatMap((result) => result.failures)
    const articles = results.flatMap((result) => result.articles)

    for (const { source, error } of failures) {
      logger.warn(`Source failed (${source}): ${error.detail ?? error.message}`)
    }

    // Only an error if *everything* failed; otherwise show what we have.
    if (articles.length === 0 && failures.length > 0 && failures.length >= jobs.length) {
      throw failures[0].error instanceof NewsServiceError
        ? failures[0].error
        : new NewsServiceError(502, 'No news source is available right now')
    }
    return articles
  }

  function mergeAndRank(articles) {
    const sorted = [...articles].sort(
      (a, b) => new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0)
    )

    const seenIds = new Set()
    const seenTitles = new Set()
    const merged = []
    for (const article of sorted) {
      const title = titleKey(article.title)
      if (seenIds.has(article.id) || seenTitles.has(title)) continue
      seenIds.add(article.id)
      seenTitles.add(title)
      merged.push(article)
    }
    return merged
  }

  async function getNews({ section = 'all', q = '', page = 1 }) {
    if (!SECTIONS[section]) {
      throw new NewsServiceError(400, 'Invalid news section')
    }

    const merged = mergeAndRank(await collect(section, q))
    const start = (page - 1) * PAGE_SIZE
    const reachable = Math.min(merged.length, MAX_PAGE * PAGE_SIZE)

    return {
      articles: merged.slice(start, start + PAGE_SIZE),
      page,
      totalResults: merged.length,
      hasMore: page * PAGE_SIZE < reachable,
    }
  }

  return { getNews }
}

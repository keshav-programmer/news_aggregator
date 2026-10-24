import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createApp } from '../app.js'
import { createNewsService, PAGE_SIZE } from '../services/newsService.js'
import { createRssSource } from '../sources/rssSource.js'
import { createNewsApiSource } from '../sources/newsApiSource.js'

const silent = { error() {}, warn() {}, log() {} }

// ---------- fixtures ----------
const rssItem = ({ title, link, date, desc = 'A summary.', extra = '' }) => `
  <item>
    <title>${title}</title>
    <link>${link}</link>
    <description><![CDATA[${desc}]]></description>
    <pubDate>${new Date(date).toUTCString()}</pubDate>
    ${extra}
  </item>`

const rssXml = (items) => `<?xml version="1.0"?>
<rss version="2.0" xmlns:media="http://search.yahoo.com/mrss/" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel><title>Feed</title>${items.join('')}</channel>
</rss>`

const apiArticle = (n, extra = {}) => ({
  source: { name: `API Source ${n}` },
  title: `API Title ${n}`,
  description: `API description ${n}`,
  url: `https://api.example.com/${n}`,
  urlToImage: `https://api.example.com/${n}.jpg`,
  publishedAt: `2026-10-20T0${n}:00:00Z`,
  ...extra,
})

const ok = (body) => ({ ok: true, status: 200, json: async () => body, text: async () => body })
const fail = (status, body = {}) => ({ ok: false, status, json: async () => body, text: async () => '' })

// Routes fake network calls: NewsAPI URLs get JSON, everything else is a feed.
function setup({ rss = () => ok(rssXml([])), api = () => ok({ articles: [], totalResults: 0 }), withApi = true, ...options } = {}) {
  const calls = []
  const fetchImpl = async (url) => {
    const u = new URL(url)
    calls.push(u)
    return u.hostname === 'newsapi.org' ? api(u) : rss(u)
  }
  const common = { fetchImpl, logger: silent, ...options }
  const rssSource = createRssSource(common)
  const newsApiSource = withApi ? createNewsApiSource({ apiKey: 'k', ...common }) : null
  const newsService = createNewsService({ rssSource, newsApiSource, logger: silent })
  const app = createApp({ newsService, corsOrigins: ['http://localhost:5173'], logger: silent })
  return { app, calls, newsService }
}

async function get(app, path) {
  const server = app.listen(0)
  try {
    const res = await fetch(`http://127.0.0.1:${server.address().port}${path}`)
    return { status: res.status, body: await res.json() }
  } finally {
    server.close()
  }
}

// ---------- RSS parsing ----------
test('parses RSS items and finds images in every common place', async () => {
  const { newsService } = setup({
    withApi: false,
    rss: (u) =>
      ok(
        rssXml(
          u.hostname.includes('thehindu')
            ? [
                rssItem({
                  title: 'Hindu story',
                  link: 'https://www.thehindu.com/news/a.ece',
                  date: '2026-10-20T08:00:00Z',
                  desc: '<p>Summary with <b>markup</b>.</p>',
                  extra: '<media:content url="https://img.example.com/hindu.jpg" medium="image"/>',
                }),
              ]
            : [
                rssItem({
                  title: 'BBC story',
                  link: 'https://www.bbc.com/news/b?at_medium=RSS',
                  date: '2026-10-20T07:00:00Z',
                  extra: '<media:thumbnail url="https://img.example.com/bbc.jpg" width="240" height="135"/>',
                }),
                rssItem({
                  title: 'Enclosure story',
                  link: 'https://www.bbc.com/news/c',
                  date: '2026-10-20T06:00:00Z',
                  extra: '<enclosure url="https://img.example.com/enc.jpg" type="image/jpeg" length="1"/>',
                }),
                rssItem({
                  title: 'Inline image story',
                  link: 'https://www.bbc.com/news/d',
                  date: '2026-10-20T05:00:00Z',
                  extra: '<content:encoded><![CDATA[<img src="https://img.example.com/inline.jpg"> text]]></content:encoded>',
                }),
                rssItem({ title: 'No image story', link: 'https://www.bbc.com/news/e', date: '2026-10-20T04:00:00Z' }),
              ]
        )
      ),
  })

  const { articles } = await newsService.getNews({ section: 'india' })
  const byTitle = Object.fromEntries(articles.map((a) => [a.title, a]))

  assert.equal(byTitle['Hindu story'].image, 'https://img.example.com/hindu.jpg')
  assert.equal(byTitle['Hindu story'].description, 'Summary with markup.')
  assert.equal(byTitle['Hindu story'].source, 'The Hindu')
  assert.equal(byTitle['Hindu story'].region, 'INDIA')
  assert.equal(byTitle['Hindu story'].category, 'India')
  assert.equal(byTitle['BBC story'].image, 'https://img.example.com/bbc.jpg')
  assert.equal(byTitle['BBC story'].source, 'BBC News')
  assert.equal(byTitle['Enclosure story'].image, 'https://img.example.com/enc.jpg')
  assert.equal(byTitle['Inline image story'].image, 'https://img.example.com/inline.jpg')
  assert.equal(byTitle['No image story'].image, null)
})

// ---------- section wiring ----------
test('India reads Indian RSS feeds and NewsAPI restricted to Indian outlets', async () => {
  const { newsService, calls } = setup()
  await newsService.getNews({ section: 'india' })

  const urls = calls.map((u) => u.href)
  assert.ok(urls.some((u) => u.includes('thehindu.com/news/national')))
  assert.ok(urls.some((u) => u.includes('feeds.bbci.co.uk/news/world/asia/india')))
  const api = calls.find((u) => u.hostname === 'newsapi.org')
  assert.equal(api.pathname, '/v2/everything')
  assert.match(api.searchParams.get('domains'), /thehindu\.com/)
})

test('other sections use their own feeds', async () => {
  const { newsService, calls } = setup({ withApi: false })
  await newsService.getNews({ section: 'technology' })
  assert.deepEqual(
    calls.map((u) => u.href).sort(),
    ['https://feeds.bbci.co.uk/news/technology/rss.xml', 'https://www.thehindu.com/sci-tech/technology/feeder/default.rss']
  )
})

// ---------- merging ----------
test('merges sources newest first and removes duplicates', async () => {
  const { newsService } = setup({
    rss: () =>
      ok(
        rssXml([
          rssItem({ title: 'Shared story', link: 'https://www.bbc.com/news/x?at_medium=RSS', date: '2026-10-20T09:00:00Z' }),
          rssItem({ title: 'Oldest', link: 'https://www.bbc.com/news/old', date: '2026-10-20T01:00:00Z' }),
        ])
      ),
    api: () =>
      ok({
        totalResults: 2,
        articles: [
          apiArticle(5, { title: 'Shared Story!', url: 'https://other.com/different-url' }), // same headline, other outlet
          apiArticle(3),
        ],
      }),
  })

  const { articles } = await newsService.getNews({ section: 'world' })
  assert.deepEqual(
    articles.map((a) => a.title),
    ['Shared story', 'API Title 3', 'Oldest']
  )
})

test('drops removed, untitled and non-http items', async () => {
  const { newsService } = setup({
    rss: () =>
      ok(
        rssXml([
          rssItem({ title: 'Good', link: 'https://www.bbc.com/news/good', date: '2026-10-20T02:00:00Z' }),
          rssItem({ title: 'Bad link', link: 'javascript:alert(1)', date: '2026-10-20T02:00:00Z' }),
        ])
      ),
    api: () =>
      ok({
        totalResults: 3,
        articles: [apiArticle(1, { title: '[Removed]', url: 'https://removed.com' }), apiArticle(2, { title: null }), apiArticle(3, { urlToImage: null })],
      }),
  })
  const { articles } = await newsService.getNews({ section: 'world' })
  assert.deepEqual(articles.map((a) => a.title).sort(), ['API Title 3', 'Good'])
  assert.equal(articles.find((a) => a.title === 'API Title 3').image, null)
})

// ---------- resilience ----------
test('one broken feed does not break the page', async () => {
  const { newsService } = setup({
    withApi: false,
    rss: (u) =>
      u.hostname.includes('thehindu')
        ? fail(500)
        : ok(rssXml([rssItem({ title: 'BBC only', link: 'https://www.bbc.com/news/1', date: '2026-10-20T02:00:00Z' })])),
  })
  const { articles } = await newsService.getNews({ section: 'world' })
  assert.deepEqual(articles.map((a) => a.title), ['BBC only'])
})

test('invalid XML is treated as a failed feed', async () => {
  const { newsService } = setup({ withApi: false, rss: () => ok('<html>not a feed</html>') })
  await assert.rejects(newsService.getNews({ section: 'world' }), (e) => e.status === 502)
})

test('works without a NewsAPI key (RSS only)', async () => {
  const { app } = setup({
    withApi: false,
    rss: () => ok(rssXml([rssItem({ title: 'Hello', link: 'https://www.bbc.com/news/h', date: '2026-10-20T02:00:00Z' })])),
  })
  const { status, body } = await get(app, '/api/news?section=world')
  assert.equal(status, 200)
  assert.equal(body.articles[0].title, 'Hello')
})

test('NewsAPI failing still returns RSS articles', async () => {
  const { newsService } = setup({
    api: () => fail(401, { code: 'apiKeyInvalid', message: 'secret details' }),
    rss: () => ok(rssXml([rssItem({ title: 'From RSS', link: 'https://www.bbc.com/news/r', date: '2026-10-20T02:00:00Z' })])),
  })
  const { articles } = await newsService.getNews({ section: 'world' })
  assert.deepEqual(articles.map((a) => a.title), ['From RSS'])
})

test('when every source fails, errors are translated without leaking details', async () => {
  const cases = [
    [fail(401, { message: 'secret details' }), 502],
    [fail(429, { code: 'rateLimited' }), 429],
  ]
  for (const [apiResponse, expected] of cases) {
    const { app } = setup({ api: () => apiResponse, rss: () => fail(500) })
    const { status, body } = await get(app, '/api/news?section=world')
    assert.equal(status, expected)
    assert.ok(!JSON.stringify(body).includes('secret'))
  }

  const timeout = setup({
    api: () => {
      throw Object.assign(new Error('t'), { name: 'TimeoutError' })
    },
    rss: () => fail(500),
  })
  assert.equal((await get(timeout.app, '/api/news?section=world')).status, 504)

  const down = setup({ withApi: false, rss: () => fail(503) })
  const downResult = await get(down.app, '/api/news?section=world')
  assert.equal(downResult.status, 502)
  assert.ok(!JSON.stringify(downResult.body).includes('thehindu'))
  assert.ok(!JSON.stringify(downResult.body).includes('HTTP 503'))
})

// ---------- search & pagination ----------
test('search filters RSS items locally and is passed to NewsAPI', async () => {
  const { newsService, calls } = setup({
    rss: () =>
      ok(
        rssXml([
          rssItem({ title: 'Cricket final tonight', link: 'https://www.bbc.com/news/c1', date: '2026-10-20T02:00:00Z' }),
          rssItem({ title: 'Budget announced', link: 'https://www.bbc.com/news/c2', date: '2026-10-20T03:00:00Z' }),
        ])
      ),
  })
  const { articles } = await newsService.getNews({ section: 'world', q: 'CRICKET final' })
  assert.deepEqual(articles.map((a) => a.title), ['Cricket final tonight'])
  assert.equal(calls.find((u) => u.hostname === 'newsapi.org').searchParams.get('q'), 'CRICKET final')
})

test('paginates the merged list', async () => {
  const items = Array.from({ length: 45 }, (_, i) =>
    rssItem({ title: `Story ${i}`, link: `https://www.bbc.com/news/s${i}`, date: Date.UTC(2026, 9, 20, 0, 0, 60 - i) })
  )
  const { newsService } = setup({ withApi: false, rss: (u) => ok(rssXml(u.hostname.includes('bbc') ? items : [])) })

  const p1 = await newsService.getNews({ section: 'world', page: 1 })
  const p3 = await newsService.getNews({ section: 'world', page: 3 })
  assert.equal(p1.articles.length, PAGE_SIZE)
  assert.equal(p1.hasMore, true)
  assert.equal(p3.articles.length, 5)
  assert.equal(p3.hasMore, false)
  assert.equal(p1.totalResults, 45)
})

// ---------- caching ----------
test('feeds are cached, concurrent requests share one download, and the TTL expires', async () => {
  let time = 0
  const { newsService, calls } = setup({
    withApi: false,
    now: () => time,
    ttlMs: 1000,
    rss: async () => {
      await new Promise((r) => setTimeout(r, 10))
      return ok(rssXml([rssItem({ title: 'A', link: 'https://www.bbc.com/news/a', date: '2026-10-20T02:00:00Z' })]))
    },
  })

  await Promise.all([newsService.getNews({ section: 'technology' }), newsService.getNews({ section: 'technology' })])
  assert.equal(calls.length, 2) // 2 feeds, each downloaded once

  time = 999
  await newsService.getNews({ section: 'technology' })
  assert.equal(calls.length, 2)

  time = 1001
  await newsService.getNews({ section: 'technology' })
  assert.equal(calls.length, 4)
})

test('serves a stale copy when a feed fails after it was cached', async () => {
  let time = 0
  let down = false
  const { newsService } = setup({
    withApi: false,
    now: () => time,
    ttlMs: 1000,
    rss: () =>
      down ? fail(500) : ok(rssXml([rssItem({ title: 'Cached', link: 'https://www.bbc.com/news/z', date: '2026-10-20T02:00:00Z' })])),
  })
  await newsService.getNews({ section: 'science' })
  down = true
  time = 5000
  const { articles } = await newsService.getNews({ section: 'science' })
  assert.equal(articles[0].title, 'Cached')
})

// ---------- http layer ----------
test('rejects bad input with 400 and never touches a source', async () => {
  const { app, calls } = setup()
  for (const path of ['/api/news?section=nope', '/api/news?page=0', '/api/news?page=99', '/api/news?page=abc', `/api/news?q=${'x'.repeat(101)}`]) {
    assert.equal((await get(app, path)).status, 400, path)
  }
  assert.equal(calls.length, 0)
})

test('health endpoint and unknown API routes', async () => {
  const { app } = setup()
  assert.equal((await get(app, '/api/health')).body.status, 'ok')
  assert.equal((await get(app, '/api/nope')).status, 404)
})

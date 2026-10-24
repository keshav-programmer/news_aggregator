// Live check of every RSS feed: `npm run check:feeds`
// Run this on your own machine to see which feeds work from your network.
import { FEEDS } from '../sources/feeds.js'
import { createRssSource } from '../sources/rssSource.js'

const source = createRssSource({ ttlMs: 0, logger: { warn() {}, error() {} } })
let bad = 0

await Promise.all(
  Object.entries(FEEDS).map(async ([key, feed]) => {
    try {
      const articles = await source.getFeed(key)
      const newest = articles.map((a) => a.publishedAt).filter(Boolean).sort().at(-1)
      const withImages = articles.filter((a) => a.image).length
      console.log(
        `OK    ${key.padEnd(20)} ${String(articles.length).padStart(3)} items, ${withImages} with images, newest ${newest ?? 'unknown'}`
      )
    } catch (error) {
      bad += 1
      console.log(`FAIL  ${key.padEnd(20)} ${error.detail ?? error.message}  (${feed.url})`)
    }
  })
)

console.log(bad ? `\n${bad} feed(s) failed.` : '\nAll feeds OK.')
process.exit(bad ? 1 : 0)

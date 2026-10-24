// Every RSS feed Pressly reads. Only feeds confirmed live in October 2026
// are listed. To add an outlet, add an entry here and reference its key from
// a section in services/newsService.js. Then run `npm run check:feeds`.
//
// Terms of use matter: the BBC allows feeds on personal sites if the source is
// credited and linked (we show the source name and link to the original).
// The Times of India forbids aggregating its feeds without consent, so it is
// deliberately NOT included. Check an outlet's terms before adding it.

const hindu = (path) => `https://www.thehindu.com/${path}/feeder/default.rss`
const bbc = (path) => `https://feeds.bbci.co.uk/${path}/rss.xml`

export const FEEDS = {
  'hindu-india': { name: 'The Hindu', url: hindu('news/national'), region: 'INDIA', topic: 'India' },
  'hindu-world': { name: 'The Hindu', url: hindu('news/international'), region: 'WORLD', topic: 'World' },
  'hindu-technology': { name: 'The Hindu', url: hindu('sci-tech/technology'), region: 'INDIA', topic: 'Technology' },
  'hindu-business': { name: 'The Hindu', url: hindu('business'), region: 'INDIA', topic: 'Business' },
  'hindu-science': { name: 'The Hindu', url: hindu('sci-tech/science'), region: 'INDIA', topic: 'Science' },
  'hindu-sport': { name: 'The Hindu', url: hindu('sport'), region: 'INDIA', topic: 'Sports' },
  'hindu-entertainment': { name: 'The Hindu', url: hindu('entertainment'), region: 'INDIA', topic: 'Entertainment' },

  'bbc-india': { name: 'BBC News', url: bbc('news/world/asia/india'), region: 'INDIA', topic: 'India' },
  'bbc-world': { name: 'BBC News', url: bbc('news/world'), region: 'WORLD', topic: 'World' },
  'bbc-technology': { name: 'BBC News', url: bbc('news/technology'), region: 'WORLD', topic: 'Technology' },
  'bbc-business': { name: 'BBC News', url: bbc('news/business'), region: 'WORLD', topic: 'Business' },
  'bbc-science': { name: 'BBC News', url: bbc('news/science_and_environment'), region: 'WORLD', topic: 'Science' },
  'bbc-sport': { name: 'BBC Sport', url: bbc('sport'), region: 'WORLD', topic: 'Sports' },
  'bbc-entertainment': { name: 'BBC News', url: bbc('news/entertainment_and_arts'), region: 'WORLD', topic: 'Entertainment' },
}

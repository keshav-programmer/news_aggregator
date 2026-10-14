
import { useMemo, useState } from 'react'
import {
  Search, Bookmark, Menu, X, Globe2, Clock3,
  ArrowUpRight, TrendingUp, Newspaper, Sun,
  BookmarkCheck, ChevronRight, Zap,
} from 'lucide-react'

const categories = [
  'All News', 'India', 'World', 'Technology',
  'Business', 'Science', 'Sports', 'Entertainment',
]

const articles = [
  {
    id: 1,
    category: 'India',
    region: 'INDIA',
    title: 'India’s next chapter: the ideas and innovations shaping tomorrow',
    description:
      'Explore the developments, people and ideas influencing the country’s changing landscape.',
    source: 'The Daily Brief',
    time: '12 min ago',
    image:
      'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1000&q=85',
    featured: true,
    url: 'https://news.google.com/search?q=India',
  },
  {
    id: 2,
    category: 'Technology',
    region: 'TECHNOLOGY',
    title: 'The AI revolution is changing how the world works',
    description:
      'A closer look at emerging tools, research and the future of intelligent systems.',
    source: 'Tech Journal',
    time: '28 min ago',
    image:
      'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80',
    url: 'https://news.google.com/search?q=artificial+intelligence',
  },
  {
    id: 3,
    category: 'World',
    region: 'WORLD',
    title: 'Global leaders face a rapidly changing world',
    description:
      'The latest international developments and their impact across borders.',
    source: 'World Report',
    time: '35 min ago',
    image:
      'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=800&q=80',
    url: 'https://news.google.com/search?q=world+news',
  },
  {
    id: 4,
    category: 'Business',
    region: 'BUSINESS',
    title: 'Markets, startups and the next wave of opportunity',
    description:
      'Business trends and economic developments worth keeping on your radar.',
    source: 'Market Watch',
    time: '46 min ago',
    image:
      'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80',
    url: 'https://news.google.com/search?q=business+news',
  },
  {
    id: 5,
    category: 'Science',
    region: 'SCIENCE',
    title: 'New scientific discoveries expand our understanding',
    description:
      'Research and discoveries opening new possibilities for the future.',
    source: 'Science Today',
    time: '1 hr ago',
    image:
      'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80',
    url: 'https://news.google.com/search?q=science+news',
  },
  {
    id: 6,
    category: 'Sports',
    region: 'SPORTS',
    title: 'The sporting stories everyone is talking about',
    description:
      'Follow major competitions, athletes and the latest sporting updates.',
    source: 'Sports Desk',
    time: '1 hr ago',
    image:
      'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80',
    url: 'https://news.google.com/search?q=sports+news',
  },
  {
    id: 7,
    category: 'Entertainment',
    region: 'CULTURE',
    title: 'Inside the stories shaping film and popular culture',
    description:
      'Discover what is happening across cinema, music and entertainment.',
    source: 'Culture Desk',
    time: '2 hrs ago',
    image:
      'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80',
    url: 'https://news.google.com/search?q=entertainment+news',
  },
]

function App() {
  const [category, setCategory] = useState('All News')
  const [query, setQuery] = useState('')
  const [bookmarks, setBookmarks] = useState([])
  const [showBookmarks, setShowBookmarks] = useState(false)
  const [mobileMenu, setMobileMenu] = useState(false)

  const visibleArticles = useMemo(() => {
    return articles.filter((article) => {
      const matchesCategory =
        category === 'All News' ||
        article.category === category

      const text =
        `${article.title} ${article.description} ${article.source} ${article.category}`.toLowerCase()

      const matchesSearch = text.includes(query.toLowerCase())
      const matchesBookmarks =
        !showBookmarks || bookmarks.includes(article.id)

      return matchesCategory && matchesSearch && matchesBookmarks
    })
  }, [category, query, bookmarks, showBookmarks])

  function toggleBookmark(id) {
    setBookmarks((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id],
    )
  }

  function chooseCategory(item) {
    setCategory(item)
    setShowBookmarks(false)
    setMobileMenu(false)
  }

  return (
    <div className="min-h-screen bg-[#090b10] text-gray-100">
      {/* Top announcement bar */}
      <div className="flex items-center justify-center gap-2 border-b border-white/5 bg-orange-500/10 px-4 py-2 text-center text-xs text-orange-300">
        <Zap size={14} />
        <span>YOUR WORLD. YOUR NEWS. ALL IN ONE PLACE.</span>
      </div>

      {/* Navbar */}
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#090b10]/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <button
            onClick={() => {
              chooseCategory('All News')
              setQuery('')
            }}
            className="flex shrink-0 items-center gap-2"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 text-white">
              <Newspaper size={22} />
            </span>
            <span className="text-left text-xl font-black tracking-tight">
              PRESS<span className="text-orange-400">LY.</span>
            </span>
          </button>

          <div className="hidden flex-1 justify-center md:flex">
            <div className="flex w-full max-w-md items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 focus-within:border-orange-500/60">
              <Search size={18} className="shrink-0 text-gray-500" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search headlines, topics..."
                aria-label="Search news"
                className="w-full bg-transparent text-sm outline-none placeholder:text-gray-500"
              />
              {query && (
                <button onClick={() => setQuery('')} aria-label="Clear search">
                  <X size={16} className="text-gray-400" />
                </button>
              )}
            </div>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => {
                setShowBookmarks(!showBookmarks)
                setCategory('All News')
                setMobileMenu(false)
              }}
              className={`relative flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm transition ${
                showBookmarks
                  ? 'border-orange-500/50 bg-orange-500/10 text-orange-300'
                  : 'border-white/10 text-gray-300 hover:bg-white/5'
              }`}
            >
              {showBookmarks ? (
                <BookmarkCheck size={18} />
              ) : (
                <Bookmark size={18} />
              )}
              <span className="hidden sm:inline">Saved</span>
              {bookmarks.length > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1 text-xs text-white">
                  {bookmarks.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setMobileMenu(!mobileMenu)}
              className="rounded-xl border border-white/10 p-2.5 md:hidden"
              aria-label="Toggle menu"
            >
              {mobileMenu ? <X size={20} /> : <Menu size={20} />}
            </button>

            <button
              onClick={() =>
                alert('Profile and authentication are coming in a later milestone!')
              }
              className="hidden h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-sm font-bold text-orange-300 sm:flex"
              aria-label="Profile"
            >
              U
            </button>
          </div>
        </div>

        {/* Mobile search */}
        <div className="px-4 pb-3 md:hidden">
          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3">
            <Search size={18} className="text-gray-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search news..."
              aria-label="Search news"
              className="w-full bg-transparent text-sm outline-none placeholder:text-gray-500"
            />
          </div>
        </div>

        {/* Categories */}
        <nav
          className={`${mobileMenu ? 'block' : 'hidden'} border-t border-white/5 px-4 py-3 md:block sm:px-6 lg:px-8`}
        >
          <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto pb-1">
            {categories.map((item) => (
              <button
                key={item}
                onClick={() => chooseCategory(item)}
                className={`shrink-0 rounded-lg px-3 py-2 text-sm transition ${
                  category === item && !showBookmarks
                    ? 'bg-orange-500 font-semibold text-white'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breaking news ticker */}
        <div className="mb-8 flex items-center gap-3 overflow-hidden rounded-xl border border-orange-500/20 bg-orange-500/[0.06] p-3">
          <span className="flex shrink-0 items-center gap-2 rounded-lg bg-orange-500 px-3 py-2 text-xs font-bold tracking-wider text-white">
            <Zap size={14} /> BULLETIN
          </span>
          <div className="min-w-0 flex-1 overflow-hidden">
            <p className="truncate text-sm text-gray-300">
              Welcome to Pressly — your daily destination for Indian and world news.
            </p>
          </div>
          <TrendingUp size={18} className="hidden shrink-0 text-orange-400 sm:block" />
        </div>

        {/* Hero */}
        {!showBookmarks && category === 'All News' && !query && (
          <section className="mb-12 grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:items-center">
            <div className="py-2">
              <div className="mb-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-orange-400">
                <span className="h-2 w-2 animate-pulse rounded-full bg-orange-500" />
                Your daily briefing
              </div>

              <h1 className="max-w-2xl text-4xl font-black leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
                Stay informed.
                <br />
                <span className="text-orange-400">Stay ahead.</span>
              </h1>

              <p className="mt-5 max-w-xl text-base leading-7 text-gray-400 sm:text-lg">
                The stories that matter, from India to every corner of the world.
                Less noise, more perspective.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <button
                  onClick={() =>
                    document.getElementById('news-feed')?.scrollIntoView({
                      behavior: 'smooth',
                    })
                  }
                  className="flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-orange-400"
                >
                  Explore headlines <ArrowUpRight size={17} />
                </button>
                <button
                  onClick={() => {
                    setCategory('World')
                    setShowBookmarks(false)
                  }}
                  className="rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-gray-300 transition hover:bg-white/5"
                >
                  World news
                </button>
              </div>

              <div className="mt-8 flex items-center gap-6 border-t border-white/10 pt-6">
                <div>
                  <p className="text-2xl font-bold">{articles.length}</p>
                  <p className="mt-1 text-xs text-gray-500">Demo stories</p>
                </div>
                <div className="h-9 w-px bg-white/10" />
                <div>
                  <p className="text-2xl font-bold">8</p>
                  <p className="mt-1 text-xs text-gray-500">News sections</p>
                </div>
                <div className="h-9 w-px bg-white/10" />
                <div>
                  <p className="flex items-center gap-1 text-sm font-semibold text-emerald-400">
                    <Globe2 size={15} /> Global coverage
                  </p>
                  <p className="mt-1 text-xs text-gray-500">India + world</p>
                </div>
              </div>
            </div>

            <div className="relative min-h-[280px] overflow-hidden rounded-2xl border border-white/10 sm:min-h-[350px]">
              <img
                src={articles[0].image}
                alt="India's iconic Taj Mahal"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                <span className="rounded-md bg-orange-500 px-3 py-1.5 text-xs font-bold uppercase tracking-wider">
                  Editor's spotlight
                </span>
                <h2 className="mt-4 max-w-lg text-2xl font-bold leading-tight sm:text-3xl">
                  Stories that help you see the bigger picture.
                </h2>
                <p className="mt-3 text-sm text-gray-300">
                  India, innovation and a changing world.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Feed heading */}
        <section id="news-feed" className="scroll-mt-44">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-orange-400">
                <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />
                THE NEWSROOM
              </div>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                {showBookmarks
                  ? 'Your saved stories'
                  : query
                    ? 'Search results'
                    : category === 'All News'
                      ? 'Latest headlines'
                      : `${category} news`}
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                {visibleArticles.length} {visibleArticles.length === 1 ? 'story' : 'stories'} to explore
                {showBookmarks ? ' in your bookmarks' : ''}
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Clock3 size={15} />
              Demo content
            </div>
          </div>

          {visibleArticles.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {visibleArticles.map((article) => (
                <article
                  key={article.id}
                  className="group overflow-hidden rounded-2xl border border-white/[0.08] bg-[#10131b] transition duration-300 hover:-translate-y-1 hover:border-orange-500/30"
                >
                  <div className="relative h-52 overflow-hidden bg-gray-900">
                    <img
                      src={article.image}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <span className="absolute bottom-3 left-3 rounded-md border border-white/10 bg-black/60 px-2.5 py-1.5 text-[10px] font-bold tracking-widest text-orange-300 backdrop-blur">
                      {article.region}
                    </span>
                    <button
                      onClick={() => toggleBookmark(article.id)}
                      aria-label={
                        bookmarks.includes(article.id)
                          ? 'Remove bookmark'
                          : 'Bookmark article'
                      }
                      className={`absolute right-3 top-3 rounded-xl border p-2.5 backdrop-blur transition ${
                        bookmarks.includes(article.id)
                          ? 'border-orange-400/40 bg-orange-500 text-white'
                          : 'border-white/20 bg-black/50 text-white hover:bg-orange-500'
                      }`}
                    >
                      <Bookmark
                        size={17}
                        fill={bookmarks.includes(article.id) ? 'currentColor' : 'none'}
                      />
                    </button>
                  </div>

                  <div className="p-5">
                    <div className="mb-3 flex items-center justify-between gap-3 text-xs text-gray-500">
                      <span>{article.source}</span>
                      <span className="flex shrink-0 items-center gap-1">
                        <Clock3 size={12} /> {article.time}
                      </span>
                    </div>
                    <h3 className="line-clamp-2 text-lg font-bold leading-snug text-gray-100 transition group-hover:text-orange-300">
                      {article.title}
                    </h3>
                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-400">
                      {article.description}
                    </p>
                    <div className="mt-5 flex items-center justify-between border-t border-white/[0.07] pt-4">
                      <span className="text-xs text-gray-500">
                        {article.category}
                      </span>
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 rounded-lg bg-white/[0.06] px-3 py-2 text-xs font-semibold text-gray-200 transition hover:bg-orange-500 hover:text-white"
                      >
                        Open article <ArrowUpRight size={14} />
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-white/10 px-6 py-16 text-center">
              <Bookmark size={32} className="mx-auto text-gray-600" />
              <h3 className="mt-4 text-lg font-semibold">
                {showBookmarks ? 'No saved stories yet' : 'No stories found'}
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                {showBookmarks
                  ? 'Bookmark a news card and it will appear here.'
                  : 'Try another search or choose a different category.'}
              </p>
              <button
                onClick={() => {
                  setQuery('')
                  setCategory('All News')
                  setShowBookmarks(false)
                }}
                className="mt-5 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-400"
              >
                Explore all news
              </button>
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="mt-16 border-t border-white/10 py-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-lg font-black">
                PRESS<span className="text-orange-400">LY.</span>
              </p>
              <p className="mt-1 text-xs text-gray-500">
                A clearer view of the world.
              </p>
            </div>
            <p className="text-xs leading-5 text-gray-600">
              Learning project · Demo content, not live headlines
            </p>
          </div>
        </footer>
      </main>
    </div>
  )
}

export default App

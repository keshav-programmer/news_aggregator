import { useEffect, useMemo, useState } from 'react'
import { Zap } from 'lucide-react'
import Navbar from './components/Navbar'
import BreakingTicker from './components/BreakingTicker'
import HeroSection from './components/HeroSection'
import NewsFeed from './components/NewsFeed'
import Footer from './components/Footer'
import { labelFor } from './constants/categories'
import { useNews } from './hooks/useNews'
import { useBookmarks } from './hooks/useBookmarks'
import { useDebouncedValue } from './hooks/useDebouncedValue'
import { readStorage, writeStorage } from './utils/storage'

const THEME_KEY = 'pressly-theme'

function App() {
  const [theme, setTheme] = useState(() => (readStorage(THEME_KEY) === 'light' ? 'light' : 'dark'))
  const [category, setCategory] = useState('all')
  const [query, setQuery] = useState('')
  const [showBookmarks, setShowBookmarks] = useState(false)
  const [mobileMenu, setMobileMenu] = useState(false)

  const { bookmarks, bookmarkIds, toggleBookmark } = useBookmarks()

  // Typing updates `query` instantly; the API is only called once typing pauses.
  const trimmedQuery = query.trim()
  const debouncedQuery = useDebouncedValue(trimmedQuery, 400)
  const news = useNews(category, debouncedQuery)

  useEffect(() => {
    writeStorage(THEME_KEY, theme)
  }, [theme])

  // Saved stories are searched locally, since they're already on this device.
  const savedMatches = useMemo(() => {
    const needle = trimmedQuery.toLowerCase()
    if (!needle) return bookmarks
    return bookmarks.filter((article) =>
      `${article.title} ${article.description} ${article.source}`.toLowerCase().includes(needle)
    )
  }, [bookmarks, trimmedQuery])

  function chooseCategory(key) {
    setCategory(key)
    setShowBookmarks(false)
    setMobileMenu(false)
  }

  function resetFilters() {
    setQuery('')
    chooseCategory('all')
  }

  const isAllNews = category === 'all'

  return (
    <div
      className={`app-shell min-h-screen ${
        theme === 'light' ? 'light-theme' : 'dark-theme'
      } bg-[#090b10] text-gray-100`}
    >
      {/* Top announcement bar */}
      <div className="flex items-center justify-center gap-2 border-b border-white/5 bg-orange-500/10 px-4 py-2 text-center text-xs text-orange-300">
        <Zap size={14} />
        <span>YOUR WORLD. YOUR NEWS. ALL IN ONE PLACE.</span>
      </div>

      <Navbar
        theme={theme}
        setTheme={setTheme}
        query={query}
        setQuery={setQuery}
        category={category}
        chooseCategory={chooseCategory}
        bookmarkCount={bookmarks.length}
        showBookmarks={showBookmarks}
        setShowBookmarks={setShowBookmarks}
        mobileMenu={mobileMenu}
        setMobileMenu={setMobileMenu}
      />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <BreakingTicker headlines={news.articles.slice(0, 5)} />

        {!showBookmarks && isAllNews && !query && (
          <HeroSection
            articles={news.articles}
            loading={news.loading}
            onSelectWorld={() => chooseCategory('world')}
          />
        )}

        <NewsFeed
          articles={showBookmarks ? savedMatches : news.articles}
          loading={!showBookmarks && news.loading}
          error={showBookmarks ? '' : news.error}
          onRetry={news.retry}
          hasMore={news.hasMore}
          loadingMore={news.loadingMore}
          moreError={news.moreError}
          onLoadMore={news.loadMore}
          bookmarkIds={bookmarkIds}
          toggleBookmark={toggleBookmark}
          showBookmarks={showBookmarks}
          categoryLabel={labelFor(category)}
          isAllNews={isAllNews}
          query={trimmedQuery}
          onReset={resetFilters}
        />

        <Footer />
      </main>
    </div>
  )
}

export default App

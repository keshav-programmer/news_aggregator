
import { Bookmark, Clock3 } from 'lucide-react'
import NewsCard from './NewsCard'

function NewsFeed({
  articles,
  bookmarks,
  toggleBookmark,
  showBookmarks,
  category,
  query,
  setQuery,
  setCategory,
  setShowBookmarks,
}) {
  return (
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
            {articles.length}{' '}
            {articles.length === 1 ? 'story' : 'stories'} to explore
            {showBookmarks ? ' in your bookmarks' : ''}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Clock3 size={15} />
          Actuall content
        </div>
      </div>

      {articles.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <NewsCard
              key={article.id}
              article={article}
              isBookmarked={bookmarks.includes(article.id)}
              onToggleBookmark={toggleBookmark}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-white/10 px-6 py-16 text-center">
          <Bookmark size={32} className="mx-auto text-gray-600" />

          <h3 className="mt-4 text-lg font-semibold">
            {showBookmarks
              ? 'No saved stories yet'
              : 'No stories found'}
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
  )
}

export default NewsFeed

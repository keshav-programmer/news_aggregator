import { AlertTriangle, Bookmark, Loader2, RefreshCw, SearchX } from 'lucide-react'
import NewsCard from './NewsCard'
import NewsCardSkeleton from './NewsCardSkeleton'

function NewsFeed({
  articles,
  loading,
  error,
  onRetry,
  hasMore,
  loadingMore,
  moreError,
  onLoadMore,
  bookmarkIds,
  toggleBookmark,
  showBookmarks,
  categoryLabel,
  isAllNews,
  query,
  onReset,
}) {
  const heading = showBookmarks
    ? 'Your saved stories'
    : query
      ? `Search results for “${query}”`
      : isAllNews
        ? 'Latest headlines'
        : `${categoryLabel} news`

  return (
    <section id="news-feed" className="scroll-mt-44" aria-busy={loading}>
      <div className="mb-6">
        <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-orange-400">
          <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />
          THE NEWSROOM
        </div>

        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{heading}</h2>

        <p className="mt-2 text-sm text-gray-500" aria-live="polite">
          {loading
            ? 'Loading stories…'
            : error
              ? ''
              : `${articles.length} ${articles.length === 1 ? 'story' : 'stories'} to explore${
                  showBookmarks ? ' in your bookmarks' : ''
                }`}
        </p>
      </div>

      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <NewsCardSkeleton key={index} />
          ))}
        </div>
      ) : error ? (
        <div
          role="alert"
          className="rounded-2xl border border-dashed border-white/10 px-6 py-16 text-center"
        >
          <AlertTriangle size={32} className="mx-auto text-orange-400" />
          <h3 className="mt-4 text-lg font-semibold">Couldn’t load the news</h3>
          <p className="mt-2 text-sm text-gray-500">{error}</p>
          <button
            type="button"
            onClick={onRetry}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-400"
          >
            <RefreshCw size={16} />
            Try again
          </button>
        </div>
      ) : articles.length > 0 ? (
        <>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <NewsCard
                key={article.id}
                article={article}
                isBookmarked={bookmarkIds.has(article.id)}
                onToggleBookmark={toggleBookmark}
              />
            ))}
          </div>

          {!showBookmarks && (hasMore || moreError) && (
            <div className="mt-8 text-center">
              {moreError && (
                <p role="alert" className="mb-3 text-sm text-orange-400">
                  {moreError}
                </p>
              )}
              <button
                type="button"
                onClick={onLoadMore}
                disabled={loadingMore}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-gray-300 transition hover:bg-white/5 disabled:opacity-60"
              >
                {loadingMore && <Loader2 size={16} className="animate-spin" />}
                {loadingMore ? 'Loading…' : moreError ? 'Try again' : 'Load more stories'}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="rounded-2xl border border-dashed border-white/10 px-6 py-16 text-center">
          {showBookmarks ? (
            <Bookmark size={32} className="mx-auto text-gray-600" />
          ) : (
            <SearchX size={32} className="mx-auto text-gray-600" />
          )}

          <h3 className="mt-4 text-lg font-semibold">
            {showBookmarks && !query ? 'No saved stories yet' : 'No stories found'}
          </h3>

          <p className="mt-2 text-sm text-gray-500">
            {showBookmarks && !query
              ? 'Bookmark a news card and it will appear here.'
              : 'Try another search or choose a different category.'}
          </p>

          <button
            type="button"
            onClick={onReset}
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

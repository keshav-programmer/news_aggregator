import { useState } from 'react'
import { Bookmark, Clock3, ArrowUpRight, Newspaper } from 'lucide-react'
import { formatRelativeTime } from '../utils/time'

function NewsCard({ article, isBookmarked, onToggleBookmark }) {
  const [imageFailed, setImageFailed] = useState(false)
  const showImage = article.image && !imageFailed
  const relativeTime = formatRelativeTime(article.publishedAt)

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#10131b] transition duration-300 hover:-translate-y-1 hover:border-orange-500/30">
      {/* Article image */}
      <div className="relative h-52 overflow-hidden bg-gray-900">
        {showImage ? (
          <img
            src={article.image}
            alt=""
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={() => setImageFailed(true)}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-orange-500/20 to-white/[0.04]">
            <Newspaper size={40} className="text-orange-300/60" />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

        <span className="absolute bottom-3 left-3 rounded-md border border-white/10 bg-black/60 px-2.5 py-1.5 text-[10px] font-bold tracking-widest text-orange-300 backdrop-blur">
          {article.region}
        </span>

        {/* Bookmark button */}
        <button
          type="button"
          onClick={() => onToggleBookmark(article)}
          aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark article'}
          aria-pressed={isBookmarked}
          className={`absolute right-3 top-3 z-10 rounded-xl border p-2.5 backdrop-blur transition ${
            isBookmarked
              ? 'border-orange-400/40 bg-orange-500 text-white'
              : 'border-white/20 bg-black/50 text-white hover:bg-orange-500'
          }`}
        >
          <Bookmark size={17} fill={isBookmarked ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Article information */}
      <div className="p-5">
        <div className="mb-3 flex items-center justify-between gap-3 text-xs text-gray-500">
          <span className="truncate">{article.source}</span>

          {relativeTime && (
            <time
              dateTime={article.publishedAt}
              title={new Date(article.publishedAt).toLocaleString()}
              className="flex shrink-0 items-center gap-1"
            >
              <Clock3 size={12} />
              {relativeTime}
            </time>
          )}
        </div>

        <h3 className="line-clamp-2 text-lg font-bold leading-snug text-gray-100 transition group-hover:text-orange-300">
          {/* The ::after stretches this link over the whole card, so a click anywhere opens the article.
              The bookmark button has z-10 so it stays separately clickable. */}
          <a
            href={article.url}
            target="_blank"
            rel="noreferrer noopener"
            className="outline-none after:absolute after:inset-0 after:rounded-2xl focus-visible:after:ring-2 focus-visible:after:ring-orange-400"
          >
            {article.title}
          </a>
        </h3>

        <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-400">{article.description}</p>

        {/* Card footer */}
        <div className="mt-5 flex items-center justify-between border-t border-white/[0.07] pt-4">
          <span className="text-xs text-gray-500">{article.category}</span>

          <span
            aria-hidden="true"
            className="flex items-center gap-2 rounded-lg bg-white/[0.06] px-3 py-2 text-xs font-semibold text-gray-200 transition group-hover:bg-orange-500 group-hover:text-white"
          >
            Open article
            <ArrowUpRight size={14} />
          </span>
        </div>
      </div>
    </article>
  )
}

export default NewsCard
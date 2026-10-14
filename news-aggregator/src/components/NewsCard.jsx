
import {
  Bookmark,
  Clock3,
  ArrowUpRight,
} from 'lucide-react'

function NewsCard({ article, isBookmarked, onToggleBookmark }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-white/[0.08] bg-[#10131b] transition duration-300 hover:-translate-y-1 hover:border-orange-500/30">
      {/* Article image */}
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

        {/* Bookmark button */}
        <button
          onClick={() => onToggleBookmark(article.id)}
          aria-label={
            isBookmarked
              ? 'Remove bookmark'
              : 'Bookmark article'
          }
          aria-pressed={isBookmarked}
          className={`absolute right-3 top-3 rounded-xl border p-2.5 backdrop-blur transition ${
            isBookmarked
              ? 'border-orange-400/40 bg-orange-500 text-white'
              : 'border-white/20 bg-black/50 text-white hover:bg-orange-500'
          }`}
        >
          <Bookmark
            size={17}
            fill={isBookmarked ? 'currentColor' : 'none'}
          />
        </button>
      </div>

      {/* Article information */}
      <div className="p-5">
        <div className="mb-3 flex items-center justify-between gap-3 text-xs text-gray-500">
          <span>{article.source}</span>

          <span className="flex shrink-0 items-center gap-1">
            <Clock3 size={12} />
            {article.time}
          </span>
        </div>

        <h3 className="line-clamp-2 text-lg font-bold leading-snug text-gray-100 transition group-hover:text-orange-300">
          {article.title}
        </h3>

        <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-400">
          {article.description}
        </p>

        {/* Card footer */}
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
            Open article
            <ArrowUpRight size={14} />
          </a>
        </div>
      </div>
    </article>
  )
}

export default NewsCard

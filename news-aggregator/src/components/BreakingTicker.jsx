import { useEffect, useState } from 'react'
import { Zap, TrendingUp } from 'lucide-react'

const ROTATE_MS = 6000

function BreakingTicker({ headlines }) {
  const [index, setIndex] = useState(0)
  const count = headlines.length

  useEffect(() => {
    if (count < 2) return
    const timer = setInterval(() => setIndex((current) => current + 1), ROTATE_MS)
    return () => clearInterval(timer)
  }, [count])

  const current = count > 0 ? headlines[index % count] : null

  return (
    <div className="mb-8 flex items-center gap-3 overflow-hidden rounded-xl border border-orange-500/20 bg-orange-500/[0.06] p-3">
      <span className="flex shrink-0 items-center gap-2 rounded-lg bg-orange-500 px-3 py-2 text-xs font-bold tracking-wider text-white">
        <Zap size={14} />
        BULLETIN
      </span>

      <div className="min-w-0 flex-1 overflow-hidden">
        {current ? (
          <a
            href={current.url}
            target="_blank"
            rel="noreferrer noopener"
            className="block truncate text-sm text-gray-300 hover:text-orange-300"
          >
            {current.title}
          </a>
        ) : (
          <p className="truncate text-sm text-gray-300">
            Welcome to Pressly — your daily destination for Indian and world news.
          </p>
        )}
      </div>

      <TrendingUp size={18} className="hidden shrink-0 text-orange-400 sm:block" />
    </div>
  )
}

export default BreakingTicker

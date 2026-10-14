
import { Zap, TrendingUp } from 'lucide-react'

function BreakingTicker() {
  return (
    <div className="mb-8 flex items-center gap-3 overflow-hidden rounded-xl border border-orange-500/20 bg-orange-500/[0.06] p-3">
      <span className="flex shrink-0 items-center gap-2 rounded-lg bg-orange-500 px-3 py-2 text-xs font-bold tracking-wider text-white">
        <Zap size={14} />
        BULLETIN
      </span>

      <div className="min-w-0 flex-1 overflow-hidden">
        <p className="truncate text-sm text-gray-300">
          Welcome to Pressly — your daily destination for Indian and world
          news.
        </p>
      </div>

      <TrendingUp
        size={18}
        className="hidden shrink-0 text-orange-400 sm:block"
      />
    </div>
  )
}

export default BreakingTicker

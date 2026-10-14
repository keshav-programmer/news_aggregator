
import { Search, X } from 'lucide-react'

function SearchBar({ query, setQuery, mobile = false }) {
  return (
    <div
      className={`${
        mobile
          ? 'px-4 pb-3 md:hidden'
          : 'hidden flex-1 justify-center md:flex'
      }`}
    >
      <div
        className={`flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-4 ${
          mobile ? 'py-3' : 'w-full max-w-md py-2.5'
        } focus-within:border-orange-500/60`}
      >
        <Search size={18} className="shrink-0 text-gray-500" />

        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={
            mobile ? 'Search news...' : 'Search headlines, topics...'
          }
          aria-label="Search news"
          className="w-full bg-transparent text-sm outline-none placeholder:text-gray-500"
        />

        {query && (
          <button
            onClick={() => setQuery('')}
            aria-label="Clear search"
            type="button"
          >
            <X size={16} className="text-gray-400" />
          </button>
        )}
      </div>
    </div>
  )
}

export default SearchBar

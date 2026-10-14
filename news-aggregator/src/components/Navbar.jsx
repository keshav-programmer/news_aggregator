import SearchBar from './SearchBar'
import CategoryBar from './CategoryBar'
import {
  Bookmark,
  Menu,
  Newspaper,
  BookmarkCheck,
} from 'lucide-react'

import ThemeToggle from './ThemeToggle'

function Navbar({
  theme,
  setTheme,
  query,
  setQuery,
  category,
  chooseCategory,
  bookmarks,
  showBookmarks,
  setShowBookmarks,
  mobileMenu,
  setMobileMenu,
}) {
  const categories = [
    'All News',
    'India',
    'World',
    'Technology',
    'Business',
    'Science',
    'Sports',
    'Entertainment',
  ]

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#090b10]/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-4 sm:px-6 lg:px-8">
        {/* Logo */}
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

        {/* Theme toggle */}
        <ThemeToggle
          theme={theme}
          setTheme={setTheme}
        />

        {/* Desktop search */}
        <SearchBar
  query={query}
  setQuery={setQuery}
/>

        {/* Right-side actions */}
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => {
              setShowBookmarks(!showBookmarks)
              chooseCategory('All News')
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

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenu(!mobileMenu)}
            className="rounded-xl border border-white/10 p-2.5 md:hidden"
            aria-label="Toggle menu"
          >
            {mobileMenu ? (
              <X size={20} />
            ) : (
              <Menu size={20} />
            )}
          </button>

          {/* Profile */}
          <button
            onClick={() =>
              alert(
                'Profile and authentication are coming in a later milestone!'
              )
            }
            className="hidden h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-sm font-bold text-orange-300 sm:flex"
            aria-label="Profile"
          >
            U
          </button>
        </div>
      </div>

      {/* Mobile search */}
      <SearchBar
  query={query}
  setQuery={setQuery}
  mobile
/>

      {/* Category navigation */}
     <CategoryBar
  category={category}
  chooseCategory={chooseCategory}
  showBookmarks={showBookmarks}
  mobileMenu={mobileMenu}
/>
    </header>
  )
}

export default Navbar

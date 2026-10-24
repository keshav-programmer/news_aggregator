import { CATEGORIES } from '../constants/categories'

function CategoryBar({ category, chooseCategory, showBookmarks, mobileMenu }) {
  return (
    <nav
      aria-label="News sections"
      className={`${
        mobileMenu ? 'block' : 'hidden'
      } border-t border-white/5 px-4 py-3 md:block sm:px-6 lg:px-8`}
    >
      <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto pb-1">
        {CATEGORIES.map((item) => {
          const active = category === item.key && !showBookmarks
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => chooseCategory(item.key)}
              aria-current={active ? 'page' : undefined}
              className={`shrink-0 rounded-lg px-3 py-2 text-sm transition ${
                active
                  ? 'bg-orange-500 font-semibold text-white'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          )
        })}
      </div>
    </nav>
  )
}

export default CategoryBar

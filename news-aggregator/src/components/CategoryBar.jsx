
function CategoryBar({
  category,
  chooseCategory,
  showBookmarks,
  mobileMenu,
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
    <nav
      className={`${
        mobileMenu ? 'block' : 'hidden'
      } border-t border-white/5 px-4 py-3 md:block sm:px-6 lg:px-8`}
    >
      <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto pb-1">
        {categories.map((item) => (
          <button
            key={item}
            onClick={() => chooseCategory(item)}
            className={`shrink-0 rounded-lg px-3 py-2 text-sm transition ${
              category === item && !showBookmarks
                ? 'bg-orange-500 font-semibold text-white'
                : 'text-gray-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            {item}
          </button>
        ))}
      </div>
    </nav>
  )
}

export default CategoryBar

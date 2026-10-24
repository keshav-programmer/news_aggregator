import { useEffect, useMemo, useState } from 'react'
import { readStorage, writeStorage } from '../utils/storage'

const STORAGE_KEY = 'pressly-bookmarks'

function load() {
  try {
    const parsed = JSON.parse(readStorage(STORAGE_KEY))
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

// Whole articles are stored (not just ids) so saved stories survive
// refreshes and still show up after the live feed has moved on.
export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState(load)

  useEffect(() => {
    writeStorage(STORAGE_KEY, JSON.stringify(bookmarks))
  }, [bookmarks])

  const bookmarkIds = useMemo(() => new Set(bookmarks.map((article) => article.id)), [bookmarks])

  function toggleBookmark(article) {
    setBookmarks((previous) =>
      previous.some((item) => item.id === article.id)
        ? previous.filter((item) => item.id !== article.id)
        : [article, ...previous]
    )
  }

  return { bookmarks, bookmarkIds, toggleBookmark }
}

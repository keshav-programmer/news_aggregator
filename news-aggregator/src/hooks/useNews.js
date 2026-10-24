import { useEffect, useRef, useState } from 'react'
import { fetchNews } from '../api/news'

const EMPTY = {
  key: null,
  articles: [],
  page: 1,
  hasMore: false,
  error: '',
  loadingMore: false,
  moreError: '',
}

export function useNews(section, query) {
  const [reloadCount, setReloadCount] = useState(0)
  const [result, setResult] = useState(EMPTY)
  const activeKey = useRef(null)

  // Results are tagged with the request that produced them, so "loading" is
  // simply "the latest result doesn't belong to the current request".
  const requestKey = `${section}|${query}|${reloadCount}`
  const loading = result.key !== requestKey

  useEffect(() => {
    const controller = new AbortController()
    activeKey.current = requestKey

    fetchNews({ section, q: query, page: 1, signal: controller.signal })
      .then((data) =>
        setResult({
          ...EMPTY,
          key: requestKey,
          articles: data.articles,
          page: data.page,
          hasMore: data.hasMore,
        })
      )
      .catch((error) => {
        if (error.name === 'AbortError') return
        setResult({ ...EMPTY, key: requestKey, error: error.message })
      })

    // A newer request (fast category switching) cancels this one.
    return () => controller.abort()
  }, [requestKey, section, query])

  function loadMore() {
    if (loading || result.loadingMore || !result.hasMore) return
    const key = requestKey

    setResult((current) => ({ ...current, loadingMore: true, moreError: '' }))

    fetchNews({ section, q: query, page: result.page + 1 })
      .then((data) => {
        if (activeKey.current !== key) return
        setResult((current) => {
          const seen = new Set(current.articles.map((article) => article.id))
          return {
            ...current,
            articles: [...current.articles, ...data.articles.filter((article) => !seen.has(article.id))],
            page: data.page,
            hasMore: data.hasMore,
            loadingMore: false,
          }
        })
      })
      .catch((error) => {
        if (activeKey.current !== key) return
        setResult((current) => ({ ...current, loadingMore: false, moreError: error.message }))
      })
  }

  return {
    articles: loading ? [] : result.articles,
    loading,
    error: loading ? '' : result.error,
    hasMore: !loading && result.hasMore,
    loadingMore: result.loadingMore,
    moreError: result.moreError,
    retry: () => setReloadCount((count) => count + 1),
    loadMore,
  }
}

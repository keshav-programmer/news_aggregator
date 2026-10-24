// In dev, Vite proxies /api to the Express server (see vite.config.js).
// For a separately hosted API, set VITE_API_URL at build time.
const API_BASE = import.meta.env.VITE_API_URL ?? ''

export async function fetchNews({ section, q = '', page = 1, signal }) {
  const params = new URLSearchParams({ section, page: String(page) })
  if (q) params.set('q', q)

  let response
  try {
    response = await fetch(`${API_BASE}/api/news?${params}`, { signal })
  } catch (error) {
    if (error.name === 'AbortError') throw error
    throw new Error("Can't reach the news server. Please check it is running.", { cause: error })
  }

  const data = await response.json().catch(() => null)
  if (!response.ok) {
    throw new Error(data?.message || 'Failed to fetch news')
  }
  return data
}

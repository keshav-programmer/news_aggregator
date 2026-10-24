// Shared helpers so every source produces articles in exactly the same shape.

export const isHttpUrl = (value) => typeof value === 'string' && /^https?:\/\//i.test(value)

// Same story, different tracking parameters => same key.
export function canonicalUrl(url) {
  try {
    const { origin, pathname } = new URL(url)
    return `${origin}${pathname.replace(/\/+$/, '')}`.toLowerCase()
  } catch {
    return url
  }
}

// Used to catch the same headline published by two outlets (or two feeds).
export function titleKey(title) {
  return title.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim()
}

export function makeArticle({ title, description, url, image, publishedAt, source, region, category }) {
  return {
    id: canonicalUrl(url),
    title: title.trim(),
    description: description || 'No description available.',
    url,
    image: isHttpUrl(image) ? image : null,
    publishedAt: publishedAt || null,
    source: source || 'Unknown source',
    region,
    category,
  }
}

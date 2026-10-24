// `key` is what the API understands, `label` is what people see.
export const CATEGORIES = [
  { key: 'all', label: 'All News' },
  { key: 'india', label: 'India' },
  { key: 'world', label: 'World' },
  { key: 'technology', label: 'Technology' },
  { key: 'business', label: 'Business' },
  { key: 'science', label: 'Science' },
  { key: 'sports', label: 'Sports' },
  { key: 'entertainment', label: 'Entertainment' },
]

export const labelFor = (key) =>
  CATEGORIES.find((category) => category.key === key)?.label ?? 'News'

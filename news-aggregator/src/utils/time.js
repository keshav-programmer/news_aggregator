const UNITS = [
  ['day', 24 * 60 * 60],
  ['hour', 60 * 60],
  ['minute', 60],
]

const formatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })

// "2 hours ago", "yesterday", or a plain date once a story is a week old.
export function formatRelativeTime(iso, now = Date.now()) {
  const time = new Date(iso).getTime()
  if (!iso || Number.isNaN(time)) return ''

  const seconds = Math.round((time - now) / 1000)
  const abs = Math.abs(seconds)

  if (abs < 60) return 'just now'
  if (abs >= 7 * 24 * 60 * 60) {
    return new Date(time).toLocaleDateString('en', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  for (const [unit, size] of UNITS) {
    if (abs >= size) return formatter.format(Math.trunc(seconds / size), unit)
  }
  return ''
}

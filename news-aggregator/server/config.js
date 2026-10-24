import dotenv from 'dotenv'

dotenv.config({ quiet: true })

const toInt = (value, fallback) => {
  const parsed = Number.parseInt(value, 10)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
}

export const config = {
  port: toInt(process.env.PORT, 5000),
  newsApiKey: process.env.NEWS_API_KEY,
  // Only override for testing against a mock server.
  newsApiUrl: process.env.NEWS_API_URL || undefined,
  // Comma separated list, e.g. "http://localhost:5173,https://pressly.example.com"
  corsOrigins: (process.env.CORS_ORIGIN || 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
  cacheTtlSeconds: toInt(process.env.CACHE_TTL_SECONDS, 600),
  rssCacheTtlSeconds: toInt(process.env.RSS_CACHE_TTL_SECONDS, 300),
  upstreamTimeoutMs: toInt(process.env.UPSTREAM_TIMEOUT_MS, 8000),
  rateLimitPerMinute: toInt(process.env.RATE_LIMIT_PER_MINUTE, 60),
}

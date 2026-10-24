import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { rateLimit } from 'express-rate-limit'
import { createNewsRouter } from './routes/news.js'
import { NewsServiceError } from './errors.js'

export function createApp({ newsService, corsOrigins = [], rateLimitPerMinute = 60, logger = console }) {
  const app = express()

  app.use(helmet())
  app.use(cors({ origin: corsOrigins }))
  app.use(express.json())

  app.get('/api/health', (req, res) => res.json({ status: 'ok' }))

  app.use(
    '/api',
    rateLimit({
      windowMs: 60 * 1000,
      limit: rateLimitPerMinute,
      standardHeaders: 'draft-8',
      legacyHeaders: false,
      message: { message: 'Too many requests, please slow down' },
    })
  )

  app.use('/api', createNewsRouter(newsService))

  app.use('/api', (req, res) => res.status(404).json({ message: 'Not found' }))

  // eslint-disable-next-line no-unused-vars
  app.use((error, req, res, next) => {
    if (error instanceof NewsServiceError) {
      return res.status(error.status).json({ message: error.message })
    }
    logger.error('Unexpected error:', error)
    res.status(500).json({ message: 'Something went wrong' })
  })

  return app
}

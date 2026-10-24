import { Router } from 'express'
import { MAX_PAGE } from '../services/newsService.js'
import { NewsServiceError } from '../errors.js'

export function createNewsRouter(newsService) {
  const router = Router()

  router.get('/news', async (req, res, next) => {
    try {
      const section = String(req.query.section ?? 'all')
      const q = String(req.query.q ?? '').trim()
      const page = Number.parseInt(req.query.page ?? '1', 10)

      if (q.length > 100) {
        throw new NewsServiceError(400, 'Search query is too long')
      }
      if (!Number.isInteger(page) || page < 1 || page > MAX_PAGE) {
        throw new NewsServiceError(400, `page must be between 1 and ${MAX_PAGE}`)
      }

      res.json(await newsService.getNews({ section, q, page }))
    } catch (error) {
      next(error)
    }
  })

  return router
}

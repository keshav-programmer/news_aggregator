
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors({
  origin: 'http://localhost:5173',
}))

app.use(express.json())


app.get('/api/news', async (req, res) => {
  try {
    const allowedCategories = [
      'general',
      'business',
      'entertainment',
      'health',
      'science',
      'sports',
      'technology',
    ]

    const requestedCategory = req.query.category || 'general'

    if (!allowedCategories.includes(requestedCategory)) {
      return res.status(400).json({
        message: 'Invalid news category',
      })
    }

    const url = new URL(
      'https://newsapi.org/v2/top-headlines'
    )

    url.searchParams.set('country', 'us')
    url.searchParams.set('category', requestedCategory)
    url.searchParams.set('pageSize', '20')

    const response = await fetch(url, {
      headers: {
        'X-Api-Key': process.env.NEWS_API_KEY,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      return res.status(response.status).json({
        message: data.message || 'Failed to fetch news',
      })
    }

res.json({
  status: data.status,
  totalResults: data.totalResults,
  articles: data.articles.map((article) => ({
    id: article.url,
    category: requestedCategory,
    region: 'World',
    title: article.title,
    description: article.description || 'No description available.',
    source: article.source?.name || 'Unknown source',
    time: article.publishedAt,
    image: article.urlToImage,
    url: article.url,
  })),
})
  } catch (error) {
    console.error('News API error:', error.message)

    res.status(500).json({
      message: 'Unable to fetch news right now',
    })
  }
})


app.listen(PORT, () => {
  console.log(`Pressly server running on port ${PORT}`)
})

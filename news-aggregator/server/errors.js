export class NewsServiceError extends Error {
  constructor(status, message) {
    super(message)
    this.name = 'NewsServiceError'
    this.status = status
  }
}

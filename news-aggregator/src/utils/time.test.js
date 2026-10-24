import { test } from 'node:test'
import assert from 'node:assert/strict'
import { formatRelativeTime } from './time.js'

const now = Date.parse('2026-10-20T12:00:00Z')
const ago = (seconds) => new Date(now - seconds * 1000).toISOString()

test('recent times', () => {
  assert.equal(formatRelativeTime(ago(10), now), 'just now')
  assert.equal(formatRelativeTime(ago(5 * 60), now), '5 minutes ago')
  assert.equal(formatRelativeTime(ago(2 * 3600), now), '2 hours ago')
  assert.equal(formatRelativeTime(ago(26 * 3600), now), 'yesterday')
  assert.equal(formatRelativeTime(ago(3 * 86400), now), '3 days ago')
})

test('old times fall back to a date', () => {
  assert.match(formatRelativeTime(ago(30 * 86400), now), /2026/)
})

test('missing or invalid input gives an empty string', () => {
  assert.equal(formatRelativeTime(null, now), '')
  assert.equal(formatRelativeTime('not a date', now), '')
})

import {
  describe, expect, it,
} from 'vitest'

import { parseOriginAndRelativePath } from '../parseOriginAndRelativePath.ts'

describe('parseOriginAndRelativePath', () => {
  it('parses URL with path only', () => {
    const input = 'https://example.com/foo/bar'
    const { origin, relativePath } = parseOriginAndRelativePath(input)

    expect(origin).toBe('https://example.com')
    expect(relativePath).toBe('/foo/bar')
  })

  it('parses URL with path and query string', () => {
    const input = 'https://example.com/foo/bar?baz=qux'
    const { origin, relativePath } = parseOriginAndRelativePath(input)

    expect(origin).toBe('https://example.com')
    expect(relativePath).toBe('/foo/bar?baz=qux')
  })

  it('parses root URL correctly', () => {
    const input = 'https://example.com/'
    const { origin, relativePath } = parseOriginAndRelativePath(input)

    expect(origin).toBe('https://example.com')
    expect(relativePath).toBe('/')
  })

  it('throws on invalid URL', () => {
    expect(() => parseOriginAndRelativePath('not-a-url')).toThrow()
  })
})

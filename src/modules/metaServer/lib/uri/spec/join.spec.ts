import '@xylabs/vitest-extended'

import {
  describe, expect, it,
} from 'vitest'

import { join } from '../join.ts'

describe('join', () => {
  const cases: [string[], string][] = [
    [['https://example.com', 'foo'], 'https://example.com/foo'],
    [['https://example.com', 'foo/'], 'https://example.com/foo/'],
    [['https://example.com', 'foo', '/bar', '/baz/', 'qix'], 'https://example.com/foo/bar/baz/qix'],
  ]
  it.each(cases)('joins %s', (parts, expected) => {
    expect(join(...parts)).toBe(expected)
  })
})

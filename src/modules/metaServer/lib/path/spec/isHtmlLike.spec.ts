import '@xylabs/vitest-extended'

import type { Request } from 'express'
import {
  describe, expect, it,
} from 'vitest'

import { isHtmlLike } from '../isHtmlLike.ts'

const getRequestForUri = (uri: string) => {
  return { path: uri } as unknown as Request
}

describe('isHtmlLike', () => {
  describe('returns true when the path', () => {
    it('ends in .html', () => {
      expect(isHtmlLike(getRequestForUri('/index.html'))).toBe(true)
    })
    it('has no extension', () => {
      expect(isHtmlLike(getRequestForUri('/'))).toBe(true)
    })
    it('has an unknown web extension', () => {
      expect(isHtmlLike(getRequestForUri('/network.xyo.payload'))).toBe(true)
    })
  })
  describe('returns false when the path', () => {
    it('has a known web extension', () => {
      expect(isHtmlLike(getRequestForUri('/index.js'))).toBe(false)
    })
  })
})

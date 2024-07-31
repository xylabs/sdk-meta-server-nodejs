import Path from 'node:path'

import { Request } from 'express'

import { getAdjustedPath } from '../getAdjustedPath.ts'

const getRequestForUri = (uri: string) => {
  return {
    path: uri,
  } as unknown as Request
}

describe('getAdjustedPath', () => {
  describe('returns the real path for', () => {
    it('html extensions', () => {
      expect(getAdjustedPath(getRequestForUri('/test.html'))).toBe(`${Path.sep}test.html`)
    })
    it('nested html extensions', () => {
      expect(getAdjustedPath(getRequestForUri('/test/test.html'))).toBe(`${Path.sep}test${Path.sep}test.html`)
    })
    it('known web files with non-html extensions', () => {
      expect(getAdjustedPath(getRequestForUri('/index.js'))).toBe(`${Path.sep}index.js`)
    })
    it('non web files with extensions', () => {
      expect(getAdjustedPath(getRequestForUri('/index.js'))).toBe(`${Path.sep}index.js`)
    })
  })
  describe('appends index.html to path for', () => {
    it('folders', () => {
      expect(getAdjustedPath(getRequestForUri('/network'))).toBe(`${Path.sep}network${Path.sep}index.html`)
    })
    it('folders with dots in them', () => {
      expect(getAdjustedPath(getRequestForUri('/'))).toBe(`${Path.sep}index.html`)
    })
  })
})

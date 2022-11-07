import { Request } from 'express'
import { sep } from 'path'

import { getAdjustedPath } from './getAdjustedPath'

const getRequestForUri = (uri: string) => {
  return {
    path: uri,
  } as unknown as Request
}

describe('getAdjustedPath', () => {
  describe('returns the real path for', () => {
    it('html extensions', () => {
      expect(getAdjustedPath(getRequestForUri('/test.html'))).toBe(`${sep}test.html`)
    })
    it('nested html extensions', () => {
      expect(getAdjustedPath(getRequestForUri('/test/test.html'))).toBe(`${sep}test${sep}test.html`)
    })
    it('known web files with non-html extensions', () => {
      expect(getAdjustedPath(getRequestForUri('/index.js'))).toBe(`${sep}index.js`)
    })
    it('non web files with extensions', () => {
      expect(getAdjustedPath(getRequestForUri('/index.ts'))).toBe(`${sep}index.ts`)
    })
  })
  describe('appends index.html to path for', () => {
    it('folders', () => {
      expect(getAdjustedPath(getRequestForUri('/network'))).toBe(`${sep}network${sep}index.html`)
    })
    it('folders with dots in them', () => {
      expect(getAdjustedPath(getRequestForUri('/'))).toBe(`${sep}index.html`)
    })
  })
})

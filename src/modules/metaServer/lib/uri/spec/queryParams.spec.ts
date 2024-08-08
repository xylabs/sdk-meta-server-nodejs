import { addQueryParam, addQueryParams, removeQueryParam, removeQueryParams } from '../queryParams.ts'

describe('Query Parameters Utility', () => {
  describe('addQueryParam', () => {
    it('should add a single query param to the URL', () => {
      const url = 'https://example.com'
      const result = addQueryParam(url, 'key', 'value')
      expect(result).toBe('https://example.com/?key=value')
    })

    it('should append a query param to existing params', () => {
      const url = 'https://example.com/?existing=1'
      const result = addQueryParam(url, 'key', 'value')
      expect(result).toBe('https://example.com/?existing=1&key=value')
    })
  })

  describe('addQueryParams', () => {
    it('should add multiple query params to the URL', () => {
      const url = 'https://example.com'
      const result = addQueryParams(url, { key1: 'value1', key2: 'value2' })
      expect(result).toBe('https://example.com/?key1=value1&key2=value2')
    })

    it('should append multiple query params to existing params', () => {
      const url = 'https://example.com/?existing=1'
      const result = addQueryParams(url, { key1: 'value1', key2: 'value2' })
      expect(result).toBe('https://example.com/?existing=1&key1=value1&key2=value2')
    })
  })

  describe('removeQueryParam', () => {
    it('should remove a specific query param from the URL', () => {
      const url = 'https://example.com/?key=value&another=2'
      const result = removeQueryParam(url, 'key')
      expect(result).toBe('https://example.com/?another=2')
    })

    it('should return same URL if param is not present', () => {
      const url = 'https://example.com/?another=2'
      const result = removeQueryParam(url, 'key')
      expect(result).toBe('https://example.com/?another=2')
    })
  })

  describe('removeQueryParams', () => {
    it('should remove multiple query params from the URL', () => {
      const url = 'https://example.com/?key1=value1&key2=value2&another=3'
      const result = removeQueryParams(url, { key1: 'value1', key2: 'value2' })
      expect(result).toBe('https://example.com/?another=3')
    })

    it('should return same URL if none of the params are present', () => {
      const url = 'https://example.com/?another=3'
      const result = removeQueryParams(url, { key1: 'value1', key2: 'value2' })
      expect(result).toBe('https://example.com/?another=3')
    })
  })
})

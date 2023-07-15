import { SimpleMetaCache } from '../SimpleMetaCache'

const path1 = '/providers/netflix'
const path2 = '/providers/hulu'

const value1 = '<!DOCTYPE html><html lang="en"><head><meta property="og:image:width" content="1600"></head><body></body></html>'
const value2 = '<!DOCTYPE html><html lang="en"><head><meta property="og:image:height" content="900"></head><body></body></html>'
const merged =
  '<!DOCTYPE html><html lang="en"><head><meta property="og:image:width" content="1600"><meta property="og:image:height" content="900"></head><body></body></html>'

describe('SimpleMetaCache', () => {
  let cache: SimpleMetaCache

  beforeEach(() => {
    cache = new SimpleMetaCache()
  })

  describe('set', () => {
    it('should set the value', () => {
      cache.set(path1, value1)
      expect(cache.get(path1)).toBe(value1)
    })
  })
  describe('get', () => {
    describe('with existing value', () => {
      it('should get the value', () => {
        cache.set(path1, value1)
        expect(cache.get(path1)).toBe(value1)
      })
    })
    describe('with non-existent value', () => {
      it('should get return undefined', () => {
        expect(cache.get(path2)).toBeUndefined()
      })
    })
  })

  describe('patch', () => {
    describe('with existing value', () => {
      it('should update the value', () => {
        cache.set(path1, value1)
        cache.patch(path1, value2)
        expect(cache.get(path1)).toBe(merged)
      })
    })
    describe('with non-existent value', () => {
      test('should set the value', () => {
        cache.patch(path1, value1)
        expect(cache.get(path1)).toBe(value1)
      })
    })
  })

  describe('Object-like helpers', () => {
    beforeEach(() => {
      cache = new SimpleMetaCache()
      cache.set(path2, value2)
      cache.set(path1, value1)
    })
    describe('entries', () => {
      it('contains all entries', () => {
        const entries = cache.entries()
        expect(entries).toContainEqual([path1, value1])
        expect(entries).toContainEqual([path2, value2])
      })
    })
    describe('keys', () => {
      it('returns all keys', () => {
        const keys = cache.keys()
        expect(keys).toContain(path1)
        expect(keys).toContain(path1)
      })
      it('returns keys in alphabetical order', () => {
        const keys = cache.keys()
        expect(keys).toEqual([path2, path1].sort())
      })
    })
    test('values', () => {
      const values = cache.values()
      expect(values).toContain(value1)
      expect(values).toContain(value2)
    })
  })
})

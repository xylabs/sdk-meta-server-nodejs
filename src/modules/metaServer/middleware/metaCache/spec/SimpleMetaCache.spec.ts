import { SimpleMetaCache } from '../SimpleMetaCache'

describe('SimpleMetaCache', () => {
  let cache: SimpleMetaCache

  beforeEach(() => {
    cache = new SimpleMetaCache()
  })

  test('set and get', () => {
    cache.set('key1', 'value1')
    expect(cache.get('key1')).toBe('value1')

    // Edge case: key doesn't exist
    expect(cache.get('key2')).toBeUndefined()
  })

  test('patch', () => {
    // Trying to patch key that doesn't exist should do nothing
    cache.patch('key1', 'value1')
    expect(cache.get('key1')).toBeUndefined()

    // Set key1
    cache.set('key1', 'initialValue')
    // Patch existing key
    cache.patch('key1', 'patchedValue')
    expect(cache.get('key1')).toBe('patchedValue')
  })

  test('entries', () => {
    cache.set('key1', 'value1')
    cache.set('key2', 'value2')

    const entries = cache.entries()
    expect(entries).toContainEqual(['key1', 'value1'])
    expect(entries).toContainEqual(['key2', 'value2'])
  })

  test('keys', () => {
    cache.set('key1', 'value1')
    cache.set('key2', 'value2')

    const keys = cache.keys()
    expect(keys).toContain('key1')
    expect(keys).toContain('key2')
  })

  test('values', () => {
    cache.set('key1', 'value1')
    cache.set('key2', 'value2')

    const values = cache.values()
    expect(values).toContain('value1')
    expect(values).toContain('value2')
  })
})

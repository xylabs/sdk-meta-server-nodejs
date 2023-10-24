import { S3Cache } from '../S3Cache'

const TEST_BUCKET = 'your-test-bucket' // Replace with your test bucket name

describe.skip('S3Cache', () => {
  let s3Cache: S3Cache

  // Helper function to generate unique keys for testing
  const generateUniqueKey = (): string => `test-key-${Date.now()}-${Math.random()}`

  beforeEach(() => {
    s3Cache = new S3Cache(TEST_BUCKET, {
      region: 'your-region', // Replace with your region
      // ... any other AWS config you want to specify (e.g. credentials if they're not in environment variables or default AWS config)
    })
  })

  describe('delete', () => {
    it('should delete an object', async () => {
      const testKey = generateUniqueKey()

      // First, set a value
      await s3Cache.set(testKey, Promise.resolve(new Uint8Array([1, 2, 3])))

      // Now, delete it
      await s3Cache.delete(testKey)

      // Check if it's really deleted
      const result = await s3Cache.get(testKey)
      expect(result).toBeUndefined()
    })
  })

  describe('get', () => {
    it('should get an object', async () => {
      const testKey = generateUniqueKey()
      const testData = new Uint8Array([1, 2, 3])

      await s3Cache.set(testKey, Promise.resolve(testData))

      const result = await s3Cache.get(testKey)

      expect(result).toEqual(testData)
    })

    it('should return undefined when object is not found', async () => {
      const result = await s3Cache.get(generateUniqueKey())
      expect(result).toBeUndefined()
    })
  })

  describe('set', () => {
    it('should set an object', async () => {
      const testKey = generateUniqueKey()
      const testData = new Uint8Array([1, 2, 3])

      await s3Cache.set(testKey, Promise.resolve(testData))

      const result = await s3Cache.get(testKey)
      expect(result).toEqual(testData)
    })

    it('should delete an object if value is not provided', async () => {
      const testKey = generateUniqueKey()
      await s3Cache.set(testKey, Promise.resolve(new Uint8Array([1, 2, 3])))

      await s3Cache.set(testKey, undefined as any) // Force it to undefined for the test

      const result = await s3Cache.get(testKey)
      expect(result).toBeUndefined()
    })
  })
})

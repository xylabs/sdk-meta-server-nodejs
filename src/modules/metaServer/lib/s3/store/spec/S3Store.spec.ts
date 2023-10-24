import { S3ClientConfig } from '@aws-sdk/client-s3'
import { assertEx } from '@xylabs/assert'
import { describeIf } from '@xylabs/jest-helpers'

import { hasAwsS3ClientConfig } from '../../../aws'
import { S3Store } from '../S3Store'

const TEST_BUCKET = 'your-test-bucket'

describeIf(hasAwsS3ClientConfig()).skip('S3Store', () => {
  let config: S3ClientConfig
  let sut: S3Store

  // Helper function to generate unique keys for testing
  const generateUniqueKey = (): string => `test-key-${Date.now()}-${Math.random()}`

  beforeAll(() => {
    config = {
      credentials: {
        accessKeyId: assertEx(process.env.AWS_ACCESS_KEY_ID, 'AWS_ACCESS_KEY_ID is not defined'),
        secretAccessKey: assertEx(process.env.AWS_SECRET_ACCESS_KEY, 'AWS_SECRET_ACCESS_KEY is not defined'),
      },
      region: 'us-east-1',
    }
  })
  beforeEach(() => {
    sut = new S3Store(TEST_BUCKET, config)
  })

  describe('delete', () => {
    it('should delete an object', async () => {
      const testKey = generateUniqueKey()

      // First, set a value
      await sut.set(testKey, new Uint8Array([1, 2, 3]))

      // Now, delete it
      await sut.delete(testKey)

      // Check if it's really deleted
      const result = await sut.get(testKey)
      expect(result).toBeUndefined()
    })
  })

  describe('get', () => {
    it('should get an object', async () => {
      const testKey = generateUniqueKey()
      const testData = new Uint8Array([1, 2, 3])

      await sut.set(testKey, testData)

      const result = await sut.get(testKey)

      expect(result).toEqual(testData)
    })

    it('should return undefined when object is not found', async () => {
      const result = await sut.get(generateUniqueKey())
      expect(result).toBeUndefined()
    })
  })

  describe('set', () => {
    it('should set an object', async () => {
      const testKey = generateUniqueKey()
      const testData = new Uint8Array([1, 2, 3])

      await sut.set(testKey, testData)

      const result = await sut.get(testKey)
      expect(result).toEqual(testData)
    })

    it('should delete an object if value is not provided', async () => {
      const testKey = generateUniqueKey()
      await sut.set(testKey, new Uint8Array([1, 2, 3]))

      await sut.set(testKey, undefined)

      const result = await sut.get(testKey)
      expect(result).toBeUndefined()
    })
  })
})

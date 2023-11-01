import { S3ClientConfig } from '@aws-sdk/client-s3'
import { describeIf } from '@xylabs/jest-helpers'
import { readFile } from 'fs/promises'
import { basename, join } from 'path'

import { getAwsS3ClientConfig, getDefaultTestBucket, hasBucket } from '../../../../aws'
import { S3FileRepository } from '../S3FileRepository'

describeIf(hasBucket())('S3FileRepository', () => {
  let config: S3ClientConfig
  let sut: S3FileRepository
  let data: ArrayBuffer
  let testKey: string

  // Helper function to generate unique keys for testing
  const generateUniqueKey = (file: string): string => `test/${Date.now()}/${file}`
  const cases: [contentType: string, file: string][] = [
    ['text/html', join(__dirname, 'index.html')],
    ['image/png', join(__dirname, 'coin-dark-phone.png')],
    ['image/svg+xml', join(__dirname, 'logo.svg')],
  ]

  describe.each(cases)('with content type %s', (type, file) => {
    beforeAll(async () => {
      config = getAwsS3ClientConfig()
      data = (await readFile(file, null)).buffer
      testKey = `${generateUniqueKey(basename(file))}`
    })
    beforeEach(() => {
      sut = new S3FileRepository(getDefaultTestBucket(), config)
    })
    afterEach(async () => {
      await sut.removeFile(testKey)
    })
    describe('delete', () => {
      it('should delete an object', async () => {
        // First, set a value
        const file = { data, type, uri: testKey }
        await sut.addFile(file)

        // Now, delete it
        await sut.removeFile(testKey)

        // Check if it's really deleted
        const result = await sut.findFile(testKey)
        expect(result).toBeUndefined()
      })
    })
    describe('get', () => {
      it('should get an object', async () => {
        const file = { data, type, uri: testKey }
        await sut.addFile(file)

        const result = await sut.findFile(testKey)

        expect(result).toEqual(file)
      })

      it('should return undefined when object is not found', async () => {
        const result = await sut.findFile(generateUniqueKey('foo.html'))
        expect(result).toBeUndefined()
      })
    })
    describe('set', () => {
      it('should set an object', async () => {
        const file = { data, type, uri: testKey }
        await sut.addFile(file)

        const result = await sut.findFile(testKey)
        expect(result).toEqual(file)
      })
    })
  })
})

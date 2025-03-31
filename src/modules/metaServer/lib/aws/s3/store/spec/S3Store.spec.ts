import '@xylabs/vitest-extended'

import { readFile } from 'node:fs/promises'
import Path from 'node:path'

import type { S3ClientConfig } from '@aws-sdk/client-s3'
import {
  afterEach,
  beforeAll, beforeEach,
  describe, expect, it,
} from 'vitest'

import { getAwsS3ClientConfig } from '../../getAwsS3ClientConfig.ts'
import { getDefaultTestBucket, hasBucket } from '../../getDefaultBucket.ts'
import { S3Store } from '../S3Store.ts'

describe.skipIf(!hasBucket())('S3Store', () => {
  let config: S3ClientConfig
  let sut: S3Store
  let testData: Uint8Array
  let testKey: string

  // Helper function to generate unique keys for testing
  const generateUniqueKey = (file: string): string => `test/${Date.now()}/${file}`
  const cases: [contentType: string, file: string][] = [
    ['text/html', Path.join(__dirname, 'index.html')],
    ['image/png', Path.join(__dirname, 'coin-dark-phone.png')],
    ['image/svg+xml', Path.join(__dirname, 'logo.svg')],
  ]

  describe.each(cases)('with content type %s', (contentType, file) => {
    beforeAll(async () => {
      config = getAwsS3ClientConfig()
      const data = await readFile(file, null)
      testData = new Uint8Array(data.buffer)
      testKey = `${generateUniqueKey(Path.basename(file))}`
    })
    beforeEach(() => {
      sut = new S3Store(getDefaultTestBucket(), config)
    })
    afterEach(async () => {
      await sut.delete(testKey)
    })
    describe('delete', () => {
      it('should delete an object', async () => {
        // First, set a value
        await sut.set(testKey, testData, contentType)

        // Now, delete it
        await sut.delete(testKey)

        // Check if it's really deleted
        const result = await sut.get(testKey)
        expect(result).toBeUndefined()
      })
    })
    describe('get', () => {
      it('should get an object', async () => {
        await sut.set(testKey, testData, contentType)

        const result = await sut.get(testKey)

        expect(result).toEqual(testData)
      })

      it('should return undefined when object is not found', async () => {
        const result = await sut.get(generateUniqueKey('foo.html'))
        expect(result).toBeUndefined()
      })
    })
    describe('set', () => {
      it('should set an object', async () => {
        await sut.set(testKey, testData, contentType)

        const result = await sut.get(testKey)
        expect(result).toEqual(testData)
      })
      it('should delete an object if value is not provided', async () => {
        await sut.set(testKey, testData, contentType)

        await sut.set(testKey, undefined, contentType)

        const result = await sut.get(testKey)
        expect(result).toBeUndefined()
      })
    })
  })
})

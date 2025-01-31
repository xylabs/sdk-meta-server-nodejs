import '@xylabs/vitest-extended'

import { readFile } from 'node:fs/promises'
import Path from 'node:path'

import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import type { SuperTest, Test } from 'supertest'
import {
  beforeEach,
  describe, expect, it,
} from 'vitest'

import { getServer } from '../../../spec/index.ts'

const expectToEqualFileContents = async (actual: string, filePath: string = Path.join(__dirname, 'index.html')) => {
  // Get index.html file by reading it directly from the filesystem
  const expected = await readFile(filePath, { encoding: 'utf8' })
  expect(expected).toBeTruthy()

  // Compare served up version with actual for equality
  expect(actual).toBe(expected)
}

describe('proxyOriginal', () => {
  let server: SuperTest<Test>
  beforeEach(() => {
    // Serve up this directory
    server = getServer(__dirname)
  })
  describe('when requested resource exists', () => {
    it('serves up the original file content unmodified', async () => {
      const serverRelativePath = __filename.split(__dirname)[1]
      expect(serverRelativePath).toBeTruthy()

      // Get this file from the server
      const response = await server.get(serverRelativePath).expect(StatusCodes.OK)
      expect(response.body).toBeTruthy()
      const actual = response.body.toString()
      expect(actual).toBeTruthy()
      await expectToEqualFileContents(actual, __filename)
    })
    it('serves up the original file content unmodified on subsequent retrievals', async () => {
      const serverRelativePath = __filename.split(__dirname)[1]
      expect(serverRelativePath).toBeTruthy()

      // Get this file from the server
      const firstResponse = await server.get(serverRelativePath).expect(StatusCodes.OK)
      expect(firstResponse.body).toBeTruthy()

      // Get this file from the server again to test fs.stats caching
      // returns the same result as the first request
      const subsequentResponse = await server.get(serverRelativePath).expect(StatusCodes.OK)
      expect(subsequentResponse.body).toBeTruthy()
      expect(firstResponse.body.toString()).toBe(subsequentResponse.body.toString())
    })
  })
  describe('when requested resource does not exist', () => {
    describe('serves up default index.html when requested resource is', () => {
      const testCases = [
        ['a HTML document', '/foo/bar/index.html'],
        ['a directory', '/foo/bar/baz'],
        ['an unknown extension', '/foo/bar/network.xyo.payload'],
      ]
      it.each(testCases)('%s', async (title: string, serverRelativePath: string) => {
        expect(serverRelativePath).toBeTruthy()

        // Get this file from the server
        const response = await server.get(serverRelativePath).expect(StatusCodes.OK)
        expect(response.body).toBeTruthy()
        const actual = response.text.toString()
        expect(actual).toBeTruthy()
        await expectToEqualFileContents(actual)
      })
    })
    describe('when requested resource not HTML file', () => {
      it(`returns ${ReasonPhrases.NOT_FOUND}`, async () => {
        const serverRelativePath = '/foo/bar/index.js'
        expect(serverRelativePath).toBeTruthy()

        // Get this file from the server
        const response = await server.get(serverRelativePath).expect(StatusCodes.NOT_FOUND)
        expect(response.body).toEqual({})
      })
    })
  })
  describe('when requested resource is a directory', () => {
    it('with slash serves up the index.html in that directory', async () => {
      const serverRelativePath = '/test/'
      expect(serverRelativePath).toBeTruthy()

      // Get this file from the server
      const response = await server.get(serverRelativePath).expect(StatusCodes.OK)
      expect(response.body).toBeTruthy()
      const actual = response.text.toString()
      expect(actual).toBeTruthy()
      await expectToEqualFileContents(actual, Path.join(__dirname, 'test', 'index.html'))
    })
    it('without slash permanently redirects to directory with slash', async () => {
      const serverRelativePath = '/test'
      expect(serverRelativePath).toBeTruthy()

      // This is the behavior of Express Serve static
      // https://github.com/expressjs/express/blob/a65913776d0b16837364ee66caa1a7f38a9997c0/test/express.static.js#L301
      const response = await server.get(serverRelativePath).expect(StatusCodes.MOVED_PERMANENTLY, /Redirecting/)
      expect(response.header['location']).toEqual('/test/')
    })
    it('serves up the root index.html if no index.html exists in the directory', async () => {
      const serverRelativePath = '/test/nested/'
      expect(serverRelativePath).toBeTruthy()

      // Get this file from the server
      const response = await server.get(serverRelativePath).expect(StatusCodes.OK)
      const actual = response.text.toString()
      expect(actual).toBeTruthy()
      await expectToEqualFileContents(actual)
    })
    describe('with dot in folder', () => {
      it('serves up the index.html in that directory', async () => {
        const serverRelativePath = '/test/with.dot.in.folder.test/'
        expect(serverRelativePath).toBeTruthy()

        // Get this file from the server
        const response = await server.get(serverRelativePath).expect(StatusCodes.OK)
        expect(response.body).toBeTruthy()
        const actual = response.text.toString()
        expect(actual).toBeTruthy()
        await expectToEqualFileContents(actual, Path.join(__dirname, '/test/with.dot.in.folder.test/', 'index.html'))
      })
      it('without slash permanently redirects to directory with slash', async () => {
        const serverRelativePath = '/test/with.dot.in.folder.test'
        expect(serverRelativePath).toBeTruthy()

        // This is the behavior of Express Serve static
        // https://github.com/expressjs/express/blob/a65913776d0b16837364ee66caa1a7f38a9997c0/test/express.static.js#L301
        const response = await server.get(serverRelativePath).expect(StatusCodes.MOVED_PERMANENTLY, /Redirecting/)
        expect(response.header['location']).toEqual('/test/with.dot.in.folder.test/')
      })
      it('serves up the root index.html if no index.html exists in the directory', async () => {
        const serverRelativePath = '/test/with.dot.in.folder.test.empty/'
        expect(serverRelativePath).toBeTruthy()

        // Get this file from the server
        const response = await server.get(serverRelativePath).expect(StatusCodes.OK)
        const actual = response.text.toString()
        expect(actual).toBeTruthy()
        await expectToEqualFileContents(actual)
      })
    })
  })
})

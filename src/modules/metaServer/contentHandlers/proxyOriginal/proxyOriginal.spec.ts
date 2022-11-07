import { readFile } from 'fs/promises'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import { join } from 'path'
import { SuperTest, Test } from 'supertest'

import { getServer } from '../../test'

describe('proxyOriginal', () => {
  let server: SuperTest<Test>
  beforeEach(() => {
    // Serve up this directory
    server = getServer(__dirname)
  })
  describe('when requested file exists', () => {
    it('serves up the original file content unmodified', async () => {
      const serverRelativePath = __filename.split(__dirname)[1]
      expect(serverRelativePath).toBeTruthy()

      // Get this file from the server
      const response = await server.get(serverRelativePath).expect(StatusCodes.OK)
      expect(response.body).toBeTruthy()
      const actual = response.body.toString()
      expect(actual).toBeTruthy()

      // Get this file by reading it directly from the filesystem
      const expected = await readFile(__filename, { encoding: 'utf-8' })
      expect(expected).toBeTruthy()

      // Compare served up version with actual for equality
      expect(actual).toBe(expected)
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
    describe('when requested resource was a HTML document', () => {
      it('serves up default index.html', async () => {
        const serverRelativePath = '/foo/bar/index.html'
        expect(serverRelativePath).toBeTruthy()

        // Get this file from the server
        const response = await server.get(serverRelativePath).expect(StatusCodes.OK)
        expect(response.body).toBeTruthy()
        const actual = response.text.toString()
        expect(actual).toBeTruthy()

        // Get this file by reading it directly from the filesystem
        const expected = await readFile(join(__dirname, 'index.html'), { encoding: 'utf-8' })
        expect(expected).toBeTruthy()

        // Compare served up version with actual for equality
        expect(actual).toBe(expected)
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
    it('serves up the index.html in that directory', async () => {
      const serverRelativePath = '/test'
      expect(serverRelativePath).toBeTruthy()

      // Get this file from the server
      const response = await server.get(serverRelativePath).expect(StatusCodes.OK)
      expect(response.body).toBeTruthy()
      const actual = response.text.toString()
      expect(actual).toBeTruthy()

      // Get this file by reading it directly from the filesystem
      const expected = await readFile(join(__dirname, 'test', 'index.html'), { encoding: 'utf-8' })
      expect(expected).toBeTruthy()

      // Compare served up version with actual for equality
      expect(actual).toBe(expected)
    })
    it(`returns ${ReasonPhrases.NOT_FOUND} if no index.html exists in the directory`, async () => {
      const serverRelativePath = '/test/directory.test'
      expect(serverRelativePath).toBeTruthy()

      // Get this file from the server
      const response = await server.get(serverRelativePath).expect(StatusCodes.NOT_FOUND)
      expect(response.body).toEqual({})
    })
  })
})

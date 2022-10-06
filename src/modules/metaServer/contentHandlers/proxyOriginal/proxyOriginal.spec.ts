import { readFile } from 'fs/promises'
import { join } from 'path'

import { getServer } from '../../test'

describe('proxyOriginal', () => {
  describe('when requested file exists', () => {
    it('serves up the original file content unmodified', async () => {
      // Serve up this directory
      const server = getServer(__dirname)
      const serverRelativePath = __filename.split(__dirname)[1]
      expect(serverRelativePath).toBeTruthy()

      // Get this file from the server
      const response = await server.get(serverRelativePath).expect(200)
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
      // Serve up this directory
      const server = getServer(__dirname)
      const serverRelativePath = __filename.split(__dirname)[1]
      expect(serverRelativePath).toBeTruthy()

      // Get this file from the server
      const firstResponse = await server.get(serverRelativePath).expect(200)
      expect(firstResponse.body).toBeTruthy()

      // Get this file from the server again to test fs.stats caching
      // returns the same result as the first request
      const subsequentResponse = await server.get(serverRelativePath).expect(200)
      expect(subsequentResponse.body).toBeTruthy()
      expect(firstResponse.body.toString()).toBe(subsequentResponse.body.toString())
    })
  })
  describe('when requested file does not exist', () => {
    it('serves up default index.html', async () => {
      // Serve up this directory
      const server = getServer(__dirname)
      const serverRelativePath = '/foo/bar/index.js'
      expect(serverRelativePath).toBeTruthy()

      // Get this file from the server
      const response = await server.get(serverRelativePath).expect(200)
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
  describe('when requested resource is not a file', () => {
    it('serves up default index.html', async () => {
      // Serve up this directory
      const server = getServer(__dirname)
      const serverRelativePath = '/test/directory.test'
      expect(serverRelativePath).toBeTruthy()

      // Get this file from the server
      const response = await server.get(serverRelativePath).expect(200)
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
})

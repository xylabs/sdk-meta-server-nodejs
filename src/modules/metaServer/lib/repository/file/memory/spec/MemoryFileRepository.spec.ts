import { readFile } from 'node:fs/promises'
import Path from 'node:path'

import { MemoryFileRepository } from '../MemoryFileRepository.js'

describe('MemoryFileRepository', () => {
  let sut: MemoryFileRepository
  let data: ArrayBuffer
  let testKey: string

  // Helper function to generate unique keys for testing
  const generateUniqueKey = (file: string): string => `test/${Date.now()}/${file}`
  const cases: [contentType: string, file: string][] = [
    ['text/html', Path.join(__dirname, 'index.html')],
    ['image/png', Path.join(__dirname, 'coin-dark-phone.png')],
    ['image/svg+xml', Path.join(__dirname, 'logo.svg')],
  ]

  describe.each(cases)('with content type %s', (type, file) => {
    beforeAll(async () => {
      data = (await readFile(file, null)).buffer
      testKey = `${generateUniqueKey(Path.basename(file))}`
    })
    beforeEach(() => {
      sut = new MemoryFileRepository()
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

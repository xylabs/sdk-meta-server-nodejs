import { tryParseInt } from '@xylabs/sdk-api-express-ecs'
import { readFile } from 'fs/promises'
import { Server } from 'http'
import { join } from 'path'
import { SuperTest, Test } from 'supertest'

import { getServerOnPort } from '../../spec'

const payloadUris = [
  '/archive/temp/block/hash/eb27161e9d12403a0a2c49590ca27c215c70382fa5f8aa7d06a28ed24394748e?network=kerplunk',
  '/archive/temp/payload/hash/2096d4e1a3c0bf1ead5e7b2144bf98e39d0679c343d79c896a0d836479475e99?network=kerplunk',
]

const testServerPort = 12345

describe('archivistBlock', () => {
  let server: Server
  let agent: SuperTest<Test>
  beforeAll(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {
      // Disable `console.log` from real server starting up for these tests
    })
    const baseDir = __dirname
    ;[server, agent] = getServerOnPort(testServerPort, baseDir)
  })
  afterAll((done) => {
    server.close(done)
  })
  it.each(payloadUris)('Modifies the head with block information', async (payloadUri) => {
    // Get this file via server
    const response = await agent.get(payloadUri).expect(200)
    expect(response).toBeTruthy()

    // Validate HTML headers
    const headers = response.headers
    expect(headers).toBeTruthy()
    expect(headers['content-type']).toBeTruthy()
    expect(headers['content-type']).toBe('text/html; charset=utf-8')

    expect(headers['content-length']).toBeTruthy()
    const contentLength = tryParseInt(headers['content-length'])
    expect(contentLength).toBeDefined()
    // Read file in original HTML file
    const originalFile = await readFile(join(__dirname, 'index.html'))
    // HTTP Content-Length header should reflect that modified file is
    // bigger than original after modification
    expect(contentLength).toBeGreaterThan(originalFile.byteLength)

    // Validate HTML document
    const actual = response.text
    expect(actual).toBeTruthy()
    expect(actual).toMatchSnapshot()
  })
})

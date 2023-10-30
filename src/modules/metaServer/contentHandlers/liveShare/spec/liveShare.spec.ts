import { Server } from 'http'
import { StatusCodes } from 'http-status-codes'
import { SuperTest, Test } from 'supertest'

import { getServerOnPort } from '../../../spec'

describe('liveShare', () => {
  let server: Server
  let testClient: SuperTest<Test>
  let html: string
  const extractContentFromMeta = (property: string) => {
    const regex = new RegExp(`<meta property="${property}" content="(.*?)">`)
    const match = regex.exec(html)
    return match && match[1]
  }
  beforeAll(async () => {
    // Serve up this directory
    ;[server, testClient] = getServerOnPort(12345, __dirname)
    // Get the file from the server
    const response = await testClient.get('/other.html').expect(StatusCodes.OK)
    html = response.text
    expect(html).toBeString()
  })
  afterAll((done) => {
    server.close(() => done())
  })
  describe('page meta', () => {
    const tests = [
      ['xyo:og:image', 'http://127.0.0.1:12345/#test'],
      ['og:image', 'http://127.0.0.1:12345/other.html/preview/1200/630/img.png'],
      ['og:image:height', '630'],
      ['og:image:secure_url', 'http://127.0.0.1:12345/other.html/preview/1200/630/img.png'],
      ['og:image:type', 'image/png'],
      ['og:image:url', 'http://127.0.0.1:12345/other.html/preview/1200/630/img.png'],
      ['og:image:width', '1200'],
      ['twitter:card', 'summary_large_image'],
      ['twitter:image', 'http://127.0.0.1:12345/other.html/preview/1200/630/img.png'],
    ]
    it.each(tests)('should match the meta property %s set to %s', (prop, expected) => {
      const actual = extractContentFromMeta(prop)
      expect(actual).toBe(expected)
    })
  })
  describe.skip('page preview image', () => {
    it('should return the preview image', async () => {
      const result = await testClient.get('/other.html/preview/1200/630/img.png').expect(StatusCodes.OK)
    })
  })
})

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
    const extractContentFromMeta = (property: string, html: string) => {
      const regex = new RegExp(`<meta property="${property}" content="(.*?)">`)
      const match = regex.exec(html)
      return match && match[1]
    }
    const tests = [
      { expected: 'http://127.0.0.1:12345/#test', prop: 'xyo:og:image' },
      { expected: 'http://127.0.0.1:12345/other.html/preview/1200/630/img.png', prop: 'og:image' },
      { expected: '630', prop: 'og:image:height' },
      { expected: 'http://127.0.0.1:12345/other.html/preview/1200/630/img.png', prop: 'og:image:secure_url' },
      { expected: 'image/png', prop: 'og:image:type' },
      { expected: 'http://127.0.0.1:12345/other.html/preview/1200/630/img.png', prop: 'og:image:url' },
      { expected: '1200', prop: 'og:image:width' },
      { expected: 'summary_large_image', prop: 'twitter:card' },
      { expected: 'http://127.0.0.1:12345/other.html/preview/1200/630/img.png', prop: 'twitter:image' },
    ]
    it.each(tests)('should match the meta properties with the expected values', (test) => {
      const actual = extractContentFromMeta(test.prop, html)
      expect(actual).toBe(test.expected)
    })
  })
})

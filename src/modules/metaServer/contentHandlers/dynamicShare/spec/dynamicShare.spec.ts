import type { Server } from 'node:http'

import { StatusCodes } from 'http-status-codes'
import type { SuperTest, Test } from 'supertest'

import { getServerOnPort } from '../../../spec/index.ts'

describe('dynamicShare', () => {
  const port = 12_346
  // const serverUrl = `http://127.0.0.1:${port}`
  const requestedPage = 'other'
  const height = 630
  const width = 1200
  // const previewImagePath = `/${requestedPage}/preview/${width}/${height}/img.png`
  // const shareImageUrl = `${serverUrl}${previewImagePath}`
  const shareImageUrl = 'https://upload.wikimedia.org/wikipedia/commons/8/84/Holy_SURP_Hovhannes_Church.jpg'
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
    ;[server, testClient] = getServerOnPort(port, __dirname)
    // Get the file from the server
    const response = await testClient.get(`/${requestedPage}`).expect(StatusCodes.OK)
    html = response.text
    expect(html).toBeString()
  })
  afterAll(() => {
    server.close(() => null)
  })
  describe('page meta', () => {
    const tests = [
      // ['xyo:og:image', shareImageUrl],
      ['og:image', shareImageUrl],
      ['og:image:height', `${height}`],
      ['og:image:secure_url', shareImageUrl],
      ['og:image:type', 'image/jpeg'],
      ['og:image:url', shareImageUrl],
      ['og:image:width', `${width}`],
      ['twitter:card', 'summary_large_image'],
      ['twitter:image', shareImageUrl],
    ]
    it.each(tests)('should match the meta property %s set to %s', (prop, expected) => {
      const actual = extractContentFromMeta(prop)
      expect(actual).toBe(expected)
    })
  })
})

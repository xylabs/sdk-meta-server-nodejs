import { Server } from 'http'
import { StatusCodes } from 'http-status-codes'
import { MatchImageSnapshotOptions, toMatchImageSnapshot } from 'jest-image-snapshot'
import { SuperTest, Test } from 'supertest'

import { getServerOnPort } from '../../../spec'

describe('liveShare', () => {
  const port = 12345
  const serverUrl = `http://127.0.0.1:${port}`
  const requestedPage = 'other.html'
  const previewPage = 'index.html'
  const height = 630
  const width = 1200
  const previewImagePath = `/${requestedPage}/preview/${width}/${height}/img.png`
  const previewImageUrl = `${serverUrl}${previewImagePath}`
  let server: Server
  let testClient: SuperTest<Test>
  let html: string
  const extractContentFromMeta = (property: string) => {
    const regex = new RegExp(`<meta property="${property}" content="(.*?)">`)
    const match = regex.exec(html)
    return match && match[1]
  }
  const opts: MatchImageSnapshotOptions = {
    customDiffConfig: {
      threshold: 0.1,
    },
    failureThreshold: 0.05,
    failureThresholdType: 'percent',
  }
  beforeAll(async () => {
    expect.extend({ toMatchImageSnapshot })
    // Serve up this directory
    ;[server, testClient] = getServerOnPort(port, __dirname)
    // Get the file from the server
    const response = await testClient.get(`/${requestedPage}`).expect(StatusCodes.OK)
    html = response.text
    expect(html).toBeString()
  })
  afterAll((done) => {
    server.close(() => done())
  })
  describe('page meta', () => {
    const tests = [
      ['xyo:og:image', `${serverUrl}/${previewPage}`],
      ['og:image', previewImageUrl],
      ['og:image:height', `${height}`],
      ['og:image:secure_url', previewImageUrl],
      ['og:image:type', 'image/png'],
      ['og:image:url', previewImageUrl],
      ['og:image:width', `${width}`],
      ['twitter:card', 'summary_large_image'],
      ['twitter:image', previewImageUrl],
    ]
    it.each(tests)('should match the meta property %s set to %s', (prop, expected) => {
      const actual = extractContentFromMeta(prop)
      expect(actual).toBe(expected)
    })
  })
  describe('page preview image', () => {
    it('should return the preview image', async () => {
      const result = await testClient.get(previewImagePath).expect(StatusCodes.OK)
      expect(result.body).toBeDefined()
      const image = Buffer.from(result.body)
      expect(image).toBeDefined()
      expect(image).toMatchImageSnapshot(opts)
    })
  })
})

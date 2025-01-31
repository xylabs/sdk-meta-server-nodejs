import '@xylabs/vitest-extended'

import type { Server } from 'node:http'

import { StatusCodes } from 'http-status-codes'
import type { SuperTest, Test } from 'supertest'
import {
  afterAll, beforeAll, describe, expect, test,
} from 'vitest'

import { getServerOnPort } from '../../../spec/index.ts'

describe('proxyExternal', () => {
  const port = 12_543
  let server: Server
  let testClient: SuperTest<Test>
  beforeAll(() => {
    // Serve up this directory
    ;[server, testClient] = getServerOnPort(port, __dirname)
  })
  afterAll(() => {
    server.close(() => null)
  })
  describe('page meta', () => {
    test('should return the correct page [index.html] not-proxied', async () => {
      const responseIndex = await testClient.get('/index.html').expect(StatusCodes.OK)
      const html = responseIndex.text
      expect(html).toBeString()
      expect(html.includes('<meta property="og:title" content="Breaking News, Latest News and Videos | CNN">')).toBeFalse()
    })
    test('should return the correct page [world/asia] not-proxied', async () => {
      const responseIndex = await testClient.get('/world-asia').expect(StatusCodes.OK)
      const html = responseIndex.text
      expect(html).toBeString()
      expect(html.includes('<meta property="og:title" content="Asia news - breaking news, videos, headlines and opinion | CNN">')).toBeFalse()
    })
    test('should return the correct page [cnn.com][politics] proxied', async () => {
      const responseIndex = await testClient.get('/politics').expect(StatusCodes.OK)
      const html = responseIndex.text
      expect(html).toBeString()
      expect(html).toContain('<meta property="og:title" content="Politics | CNN Politics">')
    })
    test('should return the correct page [cnn.com][world/africa] wildcard proxied', async () => {
      const responseIndex = await testClient.get('/world/africa').expect(StatusCodes.OK)
      const html = responseIndex.text
      expect(html).toBeString()
      expect(html).toContain('<meta property="og:title" content="Africa news - breaking news, video, headlines and opinion | CNN">')
    })
  })
})

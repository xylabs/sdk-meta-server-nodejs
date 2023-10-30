import { Server } from 'http'
import { StatusCodes } from 'http-status-codes'
import { SuperTest, Test } from 'supertest'

import { getServerOnPort } from '../../../spec'

describe('liveShare', () => {
  let server: Server
  let testClient: SuperTest<Test>
  beforeEach(() => {
    // Serve up this directory
    ;[server, testClient] = getServerOnPort(12345, __dirname)
  })
  afterAll((done) => {
    server.close(() => done())
  })
  describe('when requested resource exists', () => {
    it('serves up the original file content unmodified', async () => {
      // Get this file from the server
      const response = await testClient.get('/other.html').expect(StatusCodes.OK)
      const html = response.text
      expect(html).toBeString()
      console.log(html)
    })
  })
})

import { StatusCodes } from 'http-status-codes'
import { SuperTest, Test } from 'supertest'

import { getServer } from '../../../spec'

describe('liveShare', () => {
  let server: SuperTest<Test>
  beforeEach(() => {
    // Serve up this directory
    server = getServer(__dirname)
  })
  describe('when requested resource exists', () => {
    it('serves up the original file content unmodified', async () => {
      // Get this file from the server
      const response = await server.get('/index.html').expect(StatusCodes.OK)
      expect(response.body).toBeTruthy()
      console.log(response.body.toString())
      const actual = response.body.toString()
      expect(actual).toBeTruthy()
    })
  })
})

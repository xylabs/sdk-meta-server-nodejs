import { getServer } from '../../spec'

describe('Server', () => {
  it('starts up', async () => {
    const server = getServer()
    const response = await server.get('/').expect(200)
    expect(response).toBeTruthy()
  })
})

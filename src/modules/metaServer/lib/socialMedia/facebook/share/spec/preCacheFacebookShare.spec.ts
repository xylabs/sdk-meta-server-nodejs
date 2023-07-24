import { preCacheFacebookShare } from '../preCacheFacebookShare'

const urls = ['https://www.youtube.com/watch?v=Kauv7MVPcsA']

describe('preCacheFacebookShare', () => {
  it.each(urls)('Returns element from page', async (url) => {
    const response = await preCacheFacebookShare(url)
    expect(response).toBeDefined()
    expect(response).toBeObject()
    expect(response?.url).toBe(url)
  })
})

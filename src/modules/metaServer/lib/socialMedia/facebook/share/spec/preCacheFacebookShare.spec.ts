import { preCacheFacebookShare } from '../preCacheFacebookShare'

const uris = ['https://www.youtube.com/watch?v=Kauv7MVPcsA']

describe('preCacheFacebookShare', () => {
  it.each(uris)('Returns element from page', async (uri) => {
    await preCacheFacebookShare(uri)
  })
})

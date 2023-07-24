import { describeIf } from '@xylabs/jest-helpers'

import { canGetAppAccessToken } from '../../auth'
import { preCacheFacebookShare } from '../preCacheFacebookShare'

describeIf(canGetAppAccessToken())('preCacheFacebookShare', () => {
  const urls = ['https://www.youtube.com/watch?v=Kauv7MVPcsA']
  it.each(urls)('Pre-caches the share', async (url) => {
    const response = await preCacheFacebookShare(url)
    expect(response).toBeDefined()
    expect(response).toBeObject()
    expect(response?.url).toBe(url)
  })
})

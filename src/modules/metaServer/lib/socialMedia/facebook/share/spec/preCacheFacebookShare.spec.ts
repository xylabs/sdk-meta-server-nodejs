import { describeIf } from '@xylabs/jest-helpers'

import { canGetAppAccessToken } from '../../auth/index.js'
import { preCacheFacebookShare } from '../preCacheFacebookShare.js'

describeIf(canGetAppAccessToken())('preCacheFacebookShare', () => {
  const urls = ['https://www.youtube.com/watch?v=Kauv7MVPcsA']
  it.each(urls)('Pre-caches the share', async (url) => {
    const response = await preCacheFacebookShare(url)
    expect(response).toBeDefined()
    expect(response).toBeObject()
    expect(response?.url).toBe(url)
  })
})

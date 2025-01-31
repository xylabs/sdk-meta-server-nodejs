import '@xylabs/vitest-extended'

import {
  describe, expect, it,
} from 'vitest'

import { canGetAppAccessToken } from '../../auth/index.ts'
import { preCacheFacebookShare } from '../preCacheFacebookShare.ts'

describe.skipIf(!canGetAppAccessToken())('preCacheFacebookShare', () => {
  const urls = ['https://www.youtube.com/watch?v=Kauv7MVPcsA']
  it.each(urls)('Pre-caches the share', async (url) => {
    const response = await preCacheFacebookShare(url)
    expect(response).toBeDefined()
    expect(typeof response).toBe('object')
    expect(response?.url).toBe(url)
  })
})

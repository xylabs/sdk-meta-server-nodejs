import '@xylabs/vitest-extended'

import {
  describe, expect, it,
} from 'vitest'

import { canGetAppAccessToken } from '../canGetAppAccessToken.ts'
import { tryGetAppAccessToken } from '../tryGetAppAccessToken.ts'

describe.skipIf(!canGetAppAccessToken())('tryGetAppAccessToken', () => {
  it('Returns access_token', async () => {
    const token = await tryGetAppAccessToken()
    expect(token).toBeDefined()
    expect(typeof token).toBe('string')
  })
})

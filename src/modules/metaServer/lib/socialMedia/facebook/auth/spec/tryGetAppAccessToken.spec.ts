import { describeIf } from '@xylabs/jest-helpers'

import { canGetAppAccessToken } from '../canGetAppAccessToken.js'
import { tryGetAppAccessToken } from '../tryGetAppAccessToken.js'

describeIf(canGetAppAccessToken())('tryGetAppAccessToken', () => {
  it('Returns access_token', async () => {
    const token = await tryGetAppAccessToken()
    expect(token).toBeDefined()
    expect(token).toBeString()
  })
})

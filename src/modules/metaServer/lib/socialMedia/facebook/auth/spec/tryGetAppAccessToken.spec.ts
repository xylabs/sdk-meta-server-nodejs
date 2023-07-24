import { describeIf } from '@xylabs/jest-helpers'

import { canGetAppAccessToken } from '../canGetAppAccessToken'
import { tryGetAppAccessToken } from '../tryGetAppAccessToken'

describeIf(canGetAppAccessToken())('tryGetAppAccessToken', () => {
  it('Returns access_token', async () => {
    const token = await tryGetAppAccessToken()
    expect(token).toBeDefined()
    expect(token).toBeString()
  })
})

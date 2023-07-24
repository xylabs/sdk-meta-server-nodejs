import { describeIf } from '@xylabs/jest-helpers'

import { canGetAppAccessToken } from '../canGetAppAccessToken'
import { tryGetAppAccessToken } from '../tryGetAppAccessToken'

describeIf(canGetAppAccessToken())('tryGetAppAccessToken', () => {
  it('Returns access_token', async () => {
    const response = await tryGetAppAccessToken()
    expect(response).toBeDefined()
    expect(response).toBeString()
  })
})

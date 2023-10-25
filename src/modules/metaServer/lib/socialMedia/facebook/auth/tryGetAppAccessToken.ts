import { axios } from '@xyo-network/axios'

import { tryGetAuthInfo } from './tryGetAuthInfo'

const tokenUrl = 'https://graph.facebook.com/oauth/access_token'
const grant_type = 'client_credentials'

interface AppAccessTokenResponse {
  access_token: string
  token_type: 'bearer'
}

/**
 * Obtains an access token for the app.
 * https://developers.facebook.com/docs/facebook-login/guides/access-tokens#generating-an-app-access-token
 * @returns An access token for the app
 */
export const tryGetAppAccessToken = async (): Promise<string | undefined> => {
  try {
    const { client_id, client_secret } = tryGetAuthInfo()
    if (!client_id || !client_secret) return undefined
    const params = { client_id, client_secret, grant_type }
    const response = await axios.get<AppAccessTokenResponse>(tokenUrl, { params })
    return response.data.access_token
  } catch (error) {
    console.log(`[tryGetAppAccessToken][error obtaining access token: ${error}`)
  }
  return undefined
}

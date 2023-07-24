import { axios } from '@xyo-network/axios'

import { getFacebookAppId, getFacebookAppSecret } from '../config'

const tokenUrl = 'https://graph.facebook.com/oauth/access_token'
const grant_type = 'client_credentials'

interface AppAccessTokenResponse {
  access_token: string
}

/**
 * Obtains an access token for the app.
 * https://developers.facebook.com/docs/facebook-login/guides/access-tokens#generating-an-app-access-token
 * @returns An access token for the app
 */
export const getAppAccessToken = async (): Promise<string | undefined> => {
  const client_id = getFacebookAppId()
  const client_secret = getFacebookAppSecret()
  const params = { client_id, client_secret, grant_type }
  const response = await axios.get<AppAccessTokenResponse>(tokenUrl, { params })
  return response.data.access_token
}

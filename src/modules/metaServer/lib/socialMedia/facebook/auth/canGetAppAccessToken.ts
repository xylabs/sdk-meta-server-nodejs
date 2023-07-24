import { getFacebookAppId, getFacebookAppSecret } from '../config'

/**
 * Obtains an access token for the app.
 * https://developers.facebook.com/docs/facebook-login/guides/access-tokens#generating-an-app-access-token
 * @returns An access token for the app
 */
export const canGetAppAccessToken = (): boolean => {
  const client_id = getFacebookAppId()
  const client_secret = getFacebookAppSecret()
  return client_id && client_secret ? true : false
}

import { tryGetFacebookAppId, tryGetFacebookAppSecret } from '../config/index.js'

export const tryGetAuthInfo = () => {
  const client_id = tryGetFacebookAppId()
  const client_secret = tryGetFacebookAppSecret()
  return { client_id, client_secret }
}

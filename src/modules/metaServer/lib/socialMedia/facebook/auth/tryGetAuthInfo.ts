import { getFacebookAppId, getFacebookAppSecret } from '../config'

export const tryGetAuthInfo = () => {
  const client_id = getFacebookAppId()
  const client_secret = getFacebookAppSecret()
  return { client_id, client_secret }
}

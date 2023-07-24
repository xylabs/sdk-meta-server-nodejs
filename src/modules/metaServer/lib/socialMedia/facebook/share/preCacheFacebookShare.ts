import { axios } from '@xyo-network/axios'

import { getFacebookAppId, getFacebookAppSecret, hasFacebookAppSecret } from '../config'

const openApiUrl = 'https://graph.facebook.com/'

/**
 * Pre cache a shared url
 * https://developers.facebook.com/docs/sharing/opengraph/using-objects#update
 * @param url
 */
export const preCacheFacebookShare = async (url: string): Promise<void> => {
  const access_token = await getAppAccessToken()
  const params = { access_token, id: url, scrape: true }
  await axios.post(openApiUrl, null, { params })
}

const getAppAccessToken = async () => {
  const response = await axios.get('https://graph.facebook.com/oauth/access_token', {
    params: {
      client_id: getFacebookAppId(),
      client_secret: getFacebookAppSecret(),
      grant_type: 'client_credentials',
    },
  })

  return response.data.access_token
}

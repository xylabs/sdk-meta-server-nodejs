import { axios } from '@xyo-network/axios'

import { tryGetAppAccessToken } from '../auth'

const openApiUrl = 'https://graph.facebook.com/'

const scrape = true

export interface PreCacheFacebookShareResponse {
  application: {
    id: string
    name: string
    url: string
  }
  description: string
  image: [{ url: string }]
  site_name: string
  title: string
  type: string
  updated_time: string
  url: string
}

/**
 * Pre-cache a shared url. Used to ensure that the first person who shares
 * a url has a good experience as, from the facebook docs:
 *  - the first person who shares a piece of content won't see a rendered image
 * The workaround is to pre-cache the url for them as described here:
 * https://developers.facebook.com/docs/sharing/opengraph/using-objects#update
 * This results in essentially a "pre-scrape" of the potential share url.
 * @param url The url to pre-cache
 */
export const preCacheFacebookShare = async (url: string): Promise<Partial<PreCacheFacebookShareResponse> | undefined> => {
  const access_token = await tryGetAppAccessToken()
  if (!access_token) return
  const params = { access_token, id: url, scrape }
  try {
    const response = await axios.post<Partial<PreCacheFacebookShareResponse>>(openApiUrl, null, { params })
    return response.data
  } catch (error) {
    console.log(`[preCacheFacebookShare][Error] pre-caching facebook share for ${url}`)
    console.log(`[preCacheFacebookShare][Error] ${error}`)
  }
}

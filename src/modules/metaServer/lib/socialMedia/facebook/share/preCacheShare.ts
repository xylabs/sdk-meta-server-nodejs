import { axios } from '@xyo-network/axios'

const openApiUrl = 'https://graph.facebook.com/'

/**
 * Pre cache a shared url
 * https://developers.facebook.com/docs/sharing/opengraph/using-objects#update
 * @param url
 */
export const preCacheShare = async (url: string): Promise<void> => {
  const params = { id: url, scrape: true }
  await axios.post(openApiUrl, null, { params })
}

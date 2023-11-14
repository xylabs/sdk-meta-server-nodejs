import { Meta, OpenGraphMeta, TwitterMeta } from '@xyo-network/sdk-meta'

import { defaultViewportSize } from '../../../../lib'
import { getImageUrl } from './getImageUrl'

/**
 * Generates the expected metadata for the resultant preview image of a Live Share page
 * @param url The url for the page
 * @param width The height of the preview image
 * @param height The width of the preview image
 * @returns The expected metadata for the preview image of a Live Share page
 */
export const getShareImageMeta = (url: string, width = defaultViewportSize.width, height = defaultViewportSize.height): Meta => {
  console.log(`[liveShare][getShareImageMeta][${url}]: generating`)
  const imageUrl = getImageUrl(url, width, height)
  const og: OpenGraphMeta = { image: { '': imageUrl, height, secure_url: imageUrl, type: 'image/png', url: imageUrl, width } }
  const twitter: TwitterMeta = { card: 'summary_large_image', image: { '': imageUrl } }
  const meta = { og, twitter }
  console.log(`[liveShare][getShareImageMeta][${url}]: generated`)
  return meta
}

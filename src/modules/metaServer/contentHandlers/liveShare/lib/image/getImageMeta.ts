import { Meta, OpenGraphMeta, TwitterMeta } from '@xyo-network/sdk-meta'

import { defaultViewportSize } from '../../../../lib/index.js'
import { getImageUrlFromPageUrl } from '../url/index.js'

/**
 * Generates the expected metadata for the resultant preview image of a Live Share page
 * @param url The url for the page
 * @param width The height of the preview image
 * @param height The width of the preview image
 * @returns The expected metadata for the preview image of a Live Share page
 */
export const getImageMeta = (url: string, width = defaultViewportSize.width, height = defaultViewportSize.height): Meta => {
  console.log(`[liveShare][getImageMeta][${url}]: generating`)
  const imageUrl = getImageUrlFromPageUrl(url, width, height)
  const og: OpenGraphMeta = { image: { '': imageUrl, height, 'secure_url': imageUrl, 'type': 'image/png', 'url': imageUrl, width } }
  const twitter: TwitterMeta = { card: 'summary_large_image', image: { '': imageUrl } }
  const meta = { og, twitter }
  console.log(`[liveShare][getImageMeta][${url}]: generated`)
  return meta
}

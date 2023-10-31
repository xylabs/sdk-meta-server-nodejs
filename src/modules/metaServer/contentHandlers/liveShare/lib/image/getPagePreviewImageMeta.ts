import { Meta, OpenGraphMeta, TwitterMeta } from '@xyo-network/sdk-meta'

import { defaultViewportSize, join } from '../../../../lib'
import { getImageUrl } from './getImageUrl'

/**
 * Generates the expected metadata for the preview image of a Live Share page
 * @param url The url for the page
 * @param width The height of the preview image
 * @param height The width of the preview image
 * @returns The expected metadata for the preview image of a Live Share page
 */
export const getPagePreviewImageMeta = (url: string, width = defaultViewportSize.width, height = defaultViewportSize.height): Meta => {
  console.log(`[liveShare][getPagePreviewImageMeta][${url}]: generating`)
  const imageUrl = getImageUrl(join(url, 'preview'), width, height)
  const og: OpenGraphMeta = { image: { '': imageUrl, height, secure_url: imageUrl, type: 'image/png', url: imageUrl, width } }
  const twitter: TwitterMeta = { card: 'summary_large_image', image: { '': imageUrl } }
  const meta = { og, twitter }
  console.log(`[liveShare][getPagePreviewImageMeta][${url}]: generated`)
  return meta
}

import { Meta, OpenGraphMeta, TwitterMeta } from '@xyo-network/sdk-meta'

import { defaultViewportSize, getContentType } from '../../../../lib/index.ts'
import { getImageUrlFromPage } from './getImageUrlFromPage.ts'

/**
 * Generates the expected metadata for the resultant preview image of a Live Share page
 * @param url The url for the page
 * @param width The height of the preview image
 * @param height The width of the preview image
 * @returns The expected metadata for the preview image of a Live Share page
 */
export const getImageMeta = async (url: string, width = defaultViewportSize.width, height = defaultViewportSize.height): Promise<Meta> => {
  console.log(`[dynamicShare][getImageMeta][${url}]: generating`)
  const imageUrl = await getImageUrlFromPage(url)
  const type = getContentType(imageUrl) || 'image/png'
  const og: OpenGraphMeta = { image: { '': imageUrl, height, 'secure_url': imageUrl, type, 'url': imageUrl, width } }
  const twitter: TwitterMeta = { card: 'summary_large_image', image: { '': imageUrl } }
  const meta = { og, twitter }
  console.log(`[dynamicShare][getImageMeta][${url}]: generated`)
  return meta
}

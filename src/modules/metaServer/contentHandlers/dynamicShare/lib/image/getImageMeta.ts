import type { Logger } from '@xylabs/logger'
import { IdLogger } from '@xylabs/logger'
import type {
  Meta, OpenGraphMeta, TwitterMeta,
} from '@xylabs/sdk-meta'

import { defaultViewportSize, getContentType } from '../../../../lib/index.ts'
import { getImageUrlFromPage } from './getImageUrlFromPage.ts'

/**
 * Generates the expected metadata for the resultant preview image of a Live Share page
 * @param url The url for the page
 * @param width The height of the preview image
 * @param height The width of the preview image
 * @returns The expected metadata for the preview image of a Live Share page
 */
export const getImageMeta = (
  url: string,
  renderedHtml: string,
  width = defaultViewportSize.width,
  height = defaultViewportSize.height,
  logger: Logger = new IdLogger(console, () => `dynamicShare|getImageMeta|${url}`),
): Meta => {
  logger.log('generating')
  const [imageUrl, title] = getImageUrlFromPage(url, renderedHtml)
  const type = getContentType(imageUrl) || 'image/png'
  const og: OpenGraphMeta = {
    image: {
      '': imageUrl, height, 'secure_url': imageUrl, type, 'url': imageUrl, width,
    },
  }
  const twitter: TwitterMeta = { card: 'summary_large_image', image: { '': imageUrl } }
  const meta = {
    og, twitter, title,
  }
  logger.log(`generated [${title}]`)
  return meta
}

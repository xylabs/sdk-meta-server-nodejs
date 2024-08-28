import type { Logger } from '@xylabs/logger'
import { IdLogger } from '@xylabs/logger'
import type { Page } from 'puppeteer'

/**
 * The property name of the meta element
 * which contains the preview image URL
 */
const xyoOgImageProperty = 'xyo:og:image'

// Define the regex pattern to match the meta element
// const xyoOgImageElementRegex = /<meta[^>]*property="xyo:og:image"[^>]*content="([^"]*)"[^>]*>/

/**
 * Returns the URL of the image from within the Dynamic Share page's meta tags
 * @param url The URL of the Dynamic Share page
 * @returns The URL of the preview image from within the Dynamic Share page's meta tags
 */
export const getImageUrlFromPage = async (
  url: string,
  page: Page,
  logger: Logger = new IdLogger(console, () => `dynamicShare|getPreviewUrlFromPage|${url}`),
): Promise<string | null | undefined> => {
  // Use puppeteer $ method to get the meta element
  const imageUrl = await (await page.$(`meta[property="${xyoOgImageProperty}"]`))?.evaluate(el => el.getAttribute('content'))
  logger.log('imageUrl', imageUrl)

  return imageUrl
}

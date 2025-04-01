import type { Logger } from '@xylabs/logger'
import { IdLogger } from '@xylabs/logger'
import type { Page } from 'puppeteer'

import { waitForImageMetaTag } from '../../../../lib/index.ts'

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
  const imageUrl = await waitForImageMetaTag(page)
  logger.log('imageUrl', imageUrl)
  return imageUrl
}

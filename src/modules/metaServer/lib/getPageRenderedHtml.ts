import { assertEx } from '@xylabs/assert'
import type { Logger } from '@xylabs/logger'
import { IdLogger } from '@xylabs/logger'
import type { Page } from 'puppeteer'

import { useSpaPage } from './page/index.ts'

/**
 * The default property name of the meta element
 * which contains the preview image URL
 */
const xyoOgImageProperty = 'xyo:og:image'

/**
 * Returns the HTML of the page from the url
 * @param url The URL of the Dynamic Share page
 * @returns The HTML string of the page
 */
export const getRenderedPage = async (
  url: string,
  waitMetaTag = xyoOgImageProperty,
  timeout = 15_000,
  logger: Logger = new IdLogger(console, () => `dynamicShare|getPreviewUrlFromPage|${url}`),
): Promise<Page> => {
  // TODO: Optimize this with something like React SSR
  const content = await useSpaPage(url, async (page) => {
    logger.log(`navigated to ${url}`)
    await page.waitForSelector('head > meta[property="xyo:og:image"]', { timeout })
    logger.log(`found meta property ${waitMetaTag}`)
    return page
  })
  return assertEx(content, () => {
    logger.error('error retrieving html')
    return 'Error'
  })
}

/**
 * Returns the HTML of the page from the url
 * @param url The URL of the Dynamic Share page
 * @returns The HTML string of the page
 */
export const getPageRenderedHtml = async (
  url: string,
  waitMetaTag = xyoOgImageProperty,
  timeout?: number,
  logger: Logger = new IdLogger(console, () => `dynamicShare|getPreviewUrlFromPage|${url}`),
): Promise<string> => {
  return (await getRenderedPage(url, waitMetaTag, timeout, logger)).content()
}

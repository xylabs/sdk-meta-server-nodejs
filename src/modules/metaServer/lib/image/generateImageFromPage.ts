import { Page, ScreenshotOptions } from 'puppeteer'

import { defaultPageRenderingOptions, PageRenderingOptions, usePage } from '../page'
import { ImageEncoding } from './ImageEncoding'
import { ImageType } from './ImageType'

export type PageImageOptions = PageRenderingOptions & {
  encoding?: ImageEncoding
  type?: ImageType
}

export const defaultScreenshotOptions: ScreenshotOptions = {
  encoding: 'binary',
  type: 'png',
}

export const generateImageFromPage = (
  page: Page,
  screenshotOptions: ScreenshotOptions = defaultScreenshotOptions,
): Promise<Buffer | string | undefined> => {
  return page.screenshot(screenshotOptions)
}

export const renderAndGenerateImageFromPage = async (
  url: string,
  pageRenderingOptions: PageRenderingOptions = defaultPageRenderingOptions,
  screenshotOptions: ScreenshotOptions = defaultScreenshotOptions,
): Promise<Buffer | string | undefined> => {
  let image: Buffer | string | undefined = undefined
  await usePage(url, pageRenderingOptions, async (page: Page) => {
    image = await generateImageFromPage(page, screenshotOptions)
  })
  return image
}

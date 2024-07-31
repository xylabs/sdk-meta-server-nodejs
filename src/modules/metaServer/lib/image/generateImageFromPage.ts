import { Page, ScreenshotOptions } from 'puppeteer'

import { defaultPageRenderingOptions, PageRenderingOptions, usePage } from '../page/index.js'
import { ImageEncoding } from './ImageEncoding.js'
import { ImageType } from './ImageType.js'

export type PageImageOptions = PageRenderingOptions & {
  encoding?: ImageEncoding
  type?: ImageType
}

export const defaultScreenshotOptions: ScreenshotOptions = {
  encoding: 'base64',
  type: 'png',
}

export const generateImageStringFromPage = (page: Page, screenshotOptions: ScreenshotOptions = defaultScreenshotOptions): Promise<string> => {
  const options = { ...screenshotOptions, encoding: 'base64' } as const
  return page.screenshot(options)
}

export const generateImageBufferFromPage = (page: Page, screenshotOptions: ScreenshotOptions = defaultScreenshotOptions): Promise<Buffer> => {
  const options = { ...screenshotOptions, encoding: 'binary' } as const
  return page.screenshot(options)
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

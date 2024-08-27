import type { Page, ScreenshotOptions } from 'puppeteer'

import type { PageRenderingOptions } from '../page/index.ts'
import { defaultPageRenderingOptions, usePage } from '../page/index.ts'
import type { ImageEncoding } from './ImageEncoding.ts'
import type { ImageType } from './ImageType.ts'

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

export const generateImageBufferFromPage = (page: Page, screenshotOptions: ScreenshotOptions = defaultScreenshotOptions): Promise<Uint8Array> => {
  const options = { ...screenshotOptions, encoding: 'binary' } as const
  return page.screenshot(options)
}

export const generateImageFromPage = (
  page: Page,
  screenshotOptions: ScreenshotOptions = defaultScreenshotOptions,
): Promise<Uint8Array> => {
  return page.screenshot(screenshotOptions)
}

export const renderAndGenerateImageFromPage = async (
  url: string,
  pageRenderingOptions: PageRenderingOptions = defaultPageRenderingOptions,
  screenshotOptions: ScreenshotOptions = defaultScreenshotOptions,
): Promise<Uint8Array> => {
  let image: Uint8Array = new Uint8Array(0)
  await usePage(url, pageRenderingOptions, async (page: Page) => {
    image = await generateImageFromPage(page, screenshotOptions)
  })
  return image
}

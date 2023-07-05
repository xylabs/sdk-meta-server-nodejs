import { Page, ScreenshotOptions } from 'puppeteer'

import { ImageEncoding } from './ImageEncoding'
import { ImageType } from './ImageType'
import { PageRenderingOptions } from './PageRenderingOptions'
import { usePage } from './usePage'

export type PageImageOptions = PageRenderingOptions & {
  encoding?: ImageEncoding
  path?: string
  type?: ImageType
}

export const generateImageFromPage = async (options: PageImageOptions): Promise<Buffer | string | undefined> => {
  let image: Buffer | string | undefined = undefined
  await usePage(options, async (page: Page) => {
    const opts: ScreenshotOptions = { encoding: options.encoding || 'binary', type: options.type || 'png' }
    if (options.path) opts.path = options.path
    image = await page.screenshot(opts)
  })
  return image
}

import type { FrameWaitForFunctionOptions, Page } from 'puppeteer'

export const ImageMetaTag = 'meta[property="xyo:og:image"]'

const defaultWaitForOptions: FrameWaitForFunctionOptions = { timeout: 20_000 }

export const waitForImageMetaTag = async (page: Page, options: FrameWaitForFunctionOptions = defaultWaitForOptions): Promise<string | null> => {
  const result = await page.waitForFunction((selector) => {
    const el = document.querySelector(selector)
    const content = el?.getAttribute('content')
    return content && content.trim() !== '' ? content : null
  }, options, ImageMetaTag)
  return result.jsonValue()
}

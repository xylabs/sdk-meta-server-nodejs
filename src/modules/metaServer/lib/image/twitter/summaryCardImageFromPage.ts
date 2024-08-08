import { Page, ScreenshotOptions, Viewport } from 'puppeteer'

import { generateImageBufferFromPage } from '../generateImageFromPage.ts'

const opts: ScreenshotOptions = {
  encoding: 'binary',
  type: 'png',
}

/**
 * Must be greater than 144 and less than 4096
 */
const dimensions = 900

/**
 * From here:
 * https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/summary
 *
 * Images for this Card support an aspect ratio of 1:1 with minimum dimensions
 * of 144x144 or maximum of 4096x4096 pixels. Images must be less than 5MB in
 * size. The image will be cropped to a square on all platforms. JPG, PNG, WEBP
 * and GIF formats are supported. Only the first frame of an animated GIF will
 * be used. SVG is not supported.
 */
export const summaryCardViewport: Viewport = {
  deviceScaleFactor: 1,
  height: dimensions,
  isLandscape: false,
  isMobile: true,
  width: dimensions,
}

export const summaryCardImageFromPage = async (page: Page) => {
  await page.setViewport(summaryCardViewport)
  return generateImageBufferFromPage(page, opts)
}

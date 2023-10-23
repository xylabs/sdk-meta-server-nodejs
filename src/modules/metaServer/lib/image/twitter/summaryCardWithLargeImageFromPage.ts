import { Page, ScreenshotOptions, Viewport } from 'puppeteer'

import { defaultViewportSize } from '../../browser'
import { generateImageBufferFromPage } from '../generateImageFromPage'

const opts: ScreenshotOptions = {
  encoding: 'binary',
  type: 'png',
}

/**
 * From here:
 * https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/summary-card-with-large-image
 *
 * A URL to a unique image representing the content of the page. You should not
 * use a generic image such as your website logo, author photo, or other image
 * that spans multiple pages. Images for this Card support an aspect ratio of
 * 2:1 with minimum dimensions of 300x157 or maximum of 4096x4096 pixels.
 * Images must be less than 5MB in size. JPG, PNG, WEBP and GIF formats are
 * supported. Only the first frame of an animated GIF will be used. SVG is not
 * supported.
 */
export const summaryCardWithLargeImageViewport: Viewport = {
  ...defaultViewportSize,
  deviceScaleFactor: 1,
  isLandscape: false,
  isMobile: true,
}

export const summaryCardWithLargeImageFromPage = async (page: Page) => {
  await page.setViewport(summaryCardWithLargeImageViewport)
  return generateImageBufferFromPage(page, opts)
}

import { forget } from '@xylabs/forget'
import { Browser, Page, Viewport, WaitForOptions } from 'puppeteer'

import { defaultViewportSize, useBrowser } from '../../browser'
import { PageRenderingOptions } from '../PageRenderingOptions'
import { getBrowserPage } from './getBrowserPage'

const viewPortDefaults: Viewport = {
  ...defaultViewportSize,
  deviceScaleFactor: 1,
  hasTouch: false,
  isLandscape: false,
  isMobile: true, // So we can render as lean as possible
}

export const useSpaPageRenderingOptions: PageRenderingOptions = {
  viewportSize: viewPortDefaults,
}

/**
 * Options for waiting for navigation for typical SPA pages
 * (like React).
 * https://cloudlayer.io/blog/puppeteer-waituntil-options/
 */
export const useSpaPageWaitForOptions: WaitForOptions = {
  // waitUntil: 'domcontentloaded',
  waitUntil: 'networkidle0',
}

export const useSpaPage = async <T>(
  url: string,
  pageCallback: (page: Page) => Promise<T> | T,
  browserOptions: Viewport = viewPortDefaults,
  waitForOptions: WaitForOptions = useSpaPageWaitForOptions,
) => {
  const parsed = new URL(url)
  const { origin, pathname } = parsed
  let browser: Browser | undefined = undefined
  let page: Page | undefined = undefined
  try {
    browser = await useBrowser(browserOptions)
    page = await getBrowserPage(browser)
    await page.goto(origin)
    await page.evaluate((pathname) => window.history.pushState(null, '', pathname), pathname)
    await page.waitForNavigation(waitForOptions)
    return await pageCallback(page)
  } catch (err) {
    console.log(err)
  } finally {
    if (page) forget(page?.close())
    if (browser) forget(browser?.close())
  }
}

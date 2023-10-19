import { forget } from '@xylabs/forget'
import { Browser, Page, Viewport, WaitForOptions } from 'puppeteer'

import { defaultViewportSize, useBrowser } from '../../browser'
import { PageRenderingOptions } from '../PageRenderingOptions'
import { timeout, waitUntil } from './defaults'
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
  timeout,
  waitUntil,
  // waitUntil: 'domcontentloaded',
}

/**
 * Helper for navigating to a url within a SPA (like React). This
 * helper first navigates to the root, then uses the browser history
 * to navigate to the relative path. This also prevents an infinite
 * cycle where:
 *  - the the server intercepts the request for the route
 *  - the server attempts to render the route by making a request for the route
 *  - the server intercepts it's own request for the route
 * by first navigating to the root, then using the browser history
 * to navigate to the relative path within the app.
 * @param url The url to navigate to
 * @param pageCallback Function to execute using the browser page
 * @param browserOptions options for the browser
 * @param waitForOptions options for waiting for page navigation
 * @returns The result of the pageCallback
 */
export const useSpaPage = async <T>(
  url: string,
  pageCallback: (page: Page) => Promise<T> | T,
  browserOptions: Viewport = viewPortDefaults,
  _waitForOptions: WaitForOptions = useSpaPageWaitForOptions,
) => {
  const parsed = new URL(url)
  const { origin, pathname } = parsed
  let browser: Browser | undefined = undefined
  let page: Page | undefined = undefined
  try {
    browser = await useBrowser(browserOptions)
    page = await getBrowserPage(browser)
    // First navigate to the root
    await page.goto(origin, { timeout, waitUntil })

    // Wait for the div with id "root" to have at least one child.
    // This assumes the child is a direct descendant (using '>').
    // This assumes React will mount in a div with id="root" .
    await page.waitForSelector('#root > *', { timeout })

    // React Router DOM seems to not listen to pushState but does
    // listen to back.  So we push state to the desired path twice,
    // then go back once to trigger the navigation.
    await page.evaluate((pathname) => window.history.pushState(null, '', pathname), pathname)
    await page.evaluate((pathname) => window.history.pushState(null, '', pathname), pathname)
    await page.evaluate(() => window.history.back())

    return await pageCallback(page)
  } catch (err) {
    console.log(err)
  } finally {
    if (page) forget(page?.close())
    if (browser) forget(browser?.close())
  }
}

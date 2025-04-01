import { Mutex, Semaphore } from 'async-mutex'
import type {
  Browser, Page, Viewport, WaitForOptions,
} from 'puppeteer'

import { defaultViewportSize, useBrowser } from '../../browser/index.ts'
import type { PageRenderingOptions } from '../PageRenderingOptions.ts'
import { timeout, waitUntil } from './defaults.ts'
import { getNewPage } from './getBrowserPage.ts'

const viewPortDefaults: Viewport = {
  ...defaultViewportSize,
  deviceScaleFactor: 1,
  hasTouch: false,
  isLandscape: false,
  isMobile: true, // So we can render as lean as possible
}

export const useSpaPageRenderingOptions: PageRenderingOptions = { viewportSize: viewPortDefaults }

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

// Limit to a single browser
const browserMutex = new Mutex()
let browser: Browser | undefined

// Limit how many Puppeteer pages can be used concurrently
const MAX_CONCURRENT_TABS = 3
const pageSemaphore = new Semaphore(MAX_CONCURRENT_TABS)

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
): Promise<T | undefined> => {
  browser = await ensureBrowser(browserOptions)
  const [, releasePage] = await pageSemaphore.acquire()
  let page: Page | undefined
  try {
    const parsed = new URL(url)
    const {
      origin, pathname, search,
    } = parsed
    page = await getNewPage(browser, origin)
    const relativePath = search ? `${pathname}${search}` : pathname
    const start = Date.now()

    await navigateToRelativePath(page, relativePath)

    const duration = Date.now() - start
    console.log(`useSpaPage:profile: ${duration}ms`)

    return await pageCallback(page)
  } catch (err) {
    console.error('useSpaPage:Error', err)
  } finally {
    // Always close the page when done to prevent
    // false positives with wait for selector if the
    // desired selector exists on the previous page
    await page?.close().catch((err) => {
      console.error('useSpaPage:Error closing page:', err)
    })
    releasePage()
  }
}

export const ensureBrowser = async (
  browserOptions: Viewport = viewPortDefaults,
): Promise<Browser> => {
  return await browserMutex.runExclusive(async () => {
    if (!browser || !browser.connected) {
      try {
        await browser?.close()
      } catch (error) {
        console.log('useSpaPage: Error closing browser:', error)
      }
      browser = await useBrowser(browserOptions)
    }
    return browser
  })
}

const navigateToRelativePath = async (page: Page, relativePath: string) => {
  console.log(`Trying relative path: ${relativePath}`)
  await page.evaluate(p => history.pushState(null, '', p), relativePath)
  await page.evaluate(p => history.pushState(null, '', p), relativePath)
  await page.evaluate(() => history.back())
}

import { assertEx } from '@xylabs/assert'
import { Mutex, Semaphore } from 'async-mutex'
import type {
  Browser, Page, Viewport, WaitForOptions,
} from 'puppeteer'

import { defaultViewportSize, useBrowser } from '../../browser/index.ts'
import { parseOriginAndRelativePath } from '../../uri/index.ts'
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
let _browser: Browser | undefined

// Limit how many Puppeteer pages can be used concurrently
const MAX_CONCURRENT_TABS = 1
const PAGE_SEMAPHORE_WAIT_TIMEOUT = 10_000
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
  const start = Date.now()
  _browser = await ensureBrowser(browserOptions)
  let page: Page | undefined

  return await runSemaphoreExclusive(
    pageSemaphore,
    async () => {
      try {
        const browser = assertEx(_browser, () => 'useSpaPage:Error obtaining browser')
        const { origin, relativePath } = parseOriginAndRelativePath(url)
        page = await getNewPage(browser, origin)
        await navigateToRelativePath(page, relativePath)
        console.log(`useSpaPage:profile: ${Date.now() - start}ms`)
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
      }
    },
    PAGE_SEMAPHORE_WAIT_TIMEOUT,
  )
}

export const ensureBrowser = async (
  browserOptions: Viewport = viewPortDefaults,
): Promise<Browser> => {
  return await browserMutex.runExclusive(async () => {
    if (!_browser || !_browser.connected) {
      try {
        await _browser?.close()
      } catch (error) {
        console.error('useSpaPage: Error closing browser:', error)
      }
      _browser = await useBrowser(browserOptions)
    }
    return _browser
  })
}

const navigateToRelativePath = async (page: Page, relativePath: string) => {
  console.log(`Trying relative path: ${relativePath}`)
  await page.evaluate(p => history.pushState(null, '', p), relativePath)
  await page.evaluate(p => history.pushState(null, '', p), relativePath)
  await page.evaluate(() => history.back())
}

/**
 * Wraps a Semaphore with a runExclusive-like interface and optional timeout.
 * @param semaphore The async-mutex Semaphore
 * @param callback The function to run once a slot is acquired
 * @param timeoutMs How long to wait before timing out (optional)
 */
export async function runSemaphoreExclusive<T>(
  semaphore: Semaphore,
  callback: () => Promise<T> | T,
  timeoutMs?: number,
): Promise<T> {
  const acquire = timeoutMs
    ? Promise.race([
        semaphore.acquire(),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Semaphore acquire timeout')), timeoutMs)),
      ])
    : semaphore.acquire()

  const [, release] = await acquire

  try {
    return await callback()
  } finally {
    release()
  }
}

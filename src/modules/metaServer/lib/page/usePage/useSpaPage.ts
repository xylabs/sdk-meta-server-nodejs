import type {
  Page, Viewport, WaitForOptions,
} from 'puppeteer'

import { defaultViewportSize } from '../../browser/index.ts'
import { parseOriginAndRelativePath } from '../../uri/index.ts'
import type { PageRenderingOptions } from '../PageRenderingOptions.ts'
import { BrowserPool } from './BrowserPool.ts'
import { timeout, waitUntil } from './defaults.ts'
import { PagePool } from './PagePool.ts'

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

// Limit how many Puppeteer pages can be used concurrently
const pool = new BrowserPool(3)

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
 * @returns The result of the pageCallback
 */
export const useSpaPage = async <T>(url: string, pageCallback: (page: Page) => Promise<T> | T,
): Promise<T | undefined> => {
  const start = Date.now()
  let page: Page | undefined
  let release: (() => void) | undefined
  try {
    const { origin, relativePath } = parseOriginAndRelativePath(url)
    const pooledPage = await pool.getPage()
    page = pooledPage.page
    release = pooledPage.release
    await page.goto(origin)
    await navigateToRelativePath(page, relativePath)
    console.log(`useSpaPage:profile: ${Date.now() - start}ms`)
    return await pageCallback(page)
  } catch (err) {
    console.error('useSpaPage:Error', err)
  } finally {
    release?.()
  }
}

const navigateToRelativePath = async (page: Page, relativePath: string) => {
  console.log(`Trying relative path: ${relativePath}`)
  await page.evaluate(p => history.pushState(null, '', p), relativePath)
  await page.evaluate(p => history.pushState(null, '', p), relativePath)
  await page.evaluate(() => history.back())
}

/* eslint-disable max-statements */
import { Mutex } from 'async-mutex'
import type {
  Browser, Page, Viewport, WaitForOptions,
} from 'puppeteer'

import { defaultViewportSize, useBrowser } from '../../browser/index.ts'
import type { PageRenderingOptions } from '../PageRenderingOptions.ts'
import { timeout, waitUntil } from './defaults.ts'
import { getBrowserPage } from './getBrowserPage.ts'

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

let _browser: Browser | undefined
let _page: Page | undefined

const pageMutex = new Mutex()
const reusePage = true
const reuseBrowser = true

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
  tryCount = 2,
): Promise<T | undefined> => {
  await pageMutex.acquire()
  try {
    if (tryCount < 1) {
      return undefined
    }
    const parsed = new URL(url)
    const {
      origin, pathname, search,
    } = parsed
    const relativePath = search ? `${pathname}${search}` : pathname
    const start = Date.now()
    _browser = _browser ?? (await useBrowser(browserOptions))
    _page = _page ?? (await getBrowserPage(_browser, origin))
    // First navigate to the root
    // await page.goto(origin)

    // Wait for the div with id "root" to have at least one child.
    // This assumes the child is a direct descendant (using '>').
    // This assumes React will mount in a div with id="root" .
    // await _page.waitForSelector('#root > *', { timeout })
    // await _page.waitForFunction(() => {
    //   const root = document.querySelector('#root')
    //   // Check if the #root element has any child nodes, indicating React has rendered
    //   return root && root.childNodes.length > 0
    // }, {
    //   timeout: 30_000, // Adjust the timeout as needed
    // })

    // React Router DOM seems to not listen to pushState but does
    // listen to back.  So we push state to the desired path twice,
    // then go back once to trigger the navigation.
    console.log(`Trying relative path: ${relativePath}`)
    await _page.evaluate(relativePath => globalThis.history.pushState(null, '', relativePath), relativePath)
    await _page.evaluate(relativePath => globalThis.history.pushState(null, '', relativePath), relativePath)
    await _page.evaluate(() => globalThis.history.back())

    const duration = Date.now() - start

    console.log(`useSpaPage:profile: ${duration}ms`)

    return await pageCallback(_page)
  } catch (err) {
    // if it crashed, we restart the browser
    await _page?.close()
    await _browser?.close()
    _page = undefined
    _browser = undefined
    pageMutex.release()
    console.log(err)
    // we retry with a fresh browser and page
    const result = await useSpaPage(url, pageCallback, browserOptions, _waitForOptions, tryCount - 1)
    await pageMutex.acquire()
    return result
  } finally {
    if (!reusePage || !reuseBrowser) {
      await _page?.close()
      _page = undefined
    }
    if (!reuseBrowser) {
      await _browser?.close()
      _browser = undefined
    }
    pageMutex.release()
  }
}

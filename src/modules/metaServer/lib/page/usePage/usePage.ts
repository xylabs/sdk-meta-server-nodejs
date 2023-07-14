import { Browser, Page, Viewport, WaitForOptions } from 'puppeteer'

import { defaultViewportSize, useBrowser } from '../../browser'
import { PageRenderingOptions } from '../PageRenderingOptions'
import { getBrowserPage } from './getBrowserPage'

export const viewPortDefaults: Viewport = {
  ...defaultViewportSize,
  deviceScaleFactor: 1,
  hasTouch: false,
  isLandscape: false,
  isMobile: true, // So we can render as lean as possible
}

export const defaultPageRenderingOptions: PageRenderingOptions = {
  viewportSize: viewPortDefaults,
}

const waitForInitialPage = false
const waitForOptions: WaitForOptions = {
  waitUntil: 'domcontentloaded',
  // waitUntil: 'networkidle0',
  // waitUntil: 'networkidle2',
}
const pageGotoOptions: WaitForOptions | undefined = waitForInitialPage ? waitForOptions : undefined

// Disable warning for using deprecated headless mode as headless: 'new' is measurably slower
// https://github.com/puppeteer/puppeteer/blob/159513c8dbe2c9f51aa37dbe531d52b5daf1e106/packages/puppeteer-core/src/node/ChromeLauncher.ts#L53
process.env.PUPPETEER_DISABLE_HEADLESS_WARNING = 'true'

export const usePage = async <T>(
  url: string,
  options: PageRenderingOptions | undefined = defaultPageRenderingOptions,
  pageCallback: (page: Page) => Promise<T> | T,
) => {
  if (!options) options = defaultPageRenderingOptions
  const defaultViewport: Viewport = options?.viewportSize ? { ...viewPortDefaults, ...options.viewportSize } : { ...viewPortDefaults }
  let browser: Browser | undefined = undefined
  try {
    browser = await useBrowser(defaultViewport)
    const page = await getBrowserPage(browser)
    await page.goto(url, pageGotoOptions)
    // await page.goto(url)
    return await pageCallback(page)
  } catch (err) {
    console.log(err)
  } finally {
    // TODO: Is is safe to background this?
    void browser?.close()
  }
}

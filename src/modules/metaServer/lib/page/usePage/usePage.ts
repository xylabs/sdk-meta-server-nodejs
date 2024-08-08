import { forget } from '@xylabs/forget'
import { Browser, Page, Viewport, WaitForOptions } from 'puppeteer'

import { defaultViewportSize, useBrowser } from '../../browser/index.ts'
import { PageRenderingOptions } from '../PageRenderingOptions.ts'
import { waitUntil } from './defaults.ts'
import { getBrowserPage } from './getBrowserPage.ts'

export const pageViewPortDefaults: Viewport = {
  ...defaultViewportSize,
  deviceScaleFactor: 1,
  hasTouch: false,
  isLandscape: false,
  isMobile: true, // So we can render as lean as possible
}

export const defaultPageRenderingOptions: PageRenderingOptions = {
  viewportSize: pageViewPortDefaults,
}

const waitForInitialPage = false
const waitForOptions: WaitForOptions = {
  waitUntil,
  // waitUntil: 'domcontentloaded',
  // waitUntil: 'networkidle0',
  // waitUntil: 'networkidle2',
}
const pageGotoOptions: WaitForOptions | undefined = waitForInitialPage ? waitForOptions : undefined

export const usePage = async <T>(
  url: string,
  options: PageRenderingOptions | undefined = defaultPageRenderingOptions,
  pageCallback: (page: Page) => Promise<T> | T,
) => {
  if (!options) options = defaultPageRenderingOptions
  const defaultViewport: Viewport = options?.viewportSize ? { ...pageViewPortDefaults, ...options.viewportSize } : { ...pageViewPortDefaults }
  let browser: Browser | undefined
  let page: Page | undefined
  try {
    browser = await useBrowser(defaultViewport)
    page = await getBrowserPage(browser, url)
    await page.goto(url, pageGotoOptions)
    return await pageCallback(page)
  } catch (err) {
    console.log(err)
  } finally {
    if (page) forget(page?.close())
    if (browser) forget(browser?.close())
  }
}

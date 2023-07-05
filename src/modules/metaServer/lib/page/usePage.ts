import { launch, Page, Viewport } from 'puppeteer'

import { PageRenderingOptions } from './PageRenderingOptions'
import { defaultViewportSize } from './ViewPortSize'

const viewPortDefaults: Viewport = {
  ...defaultViewportSize,
  deviceScaleFactor: 1,
  hasTouch: false,
  isLandscape: false,
  isMobile: true, // So we can render as lean as possible
}

export const usePage = async (options: PageRenderingOptions, pageCallback: (page: Page) => Promise<void> | void) => {
  const defaultViewport: Viewport = options.viewportSize ? { ...viewPortDefaults, ...options.viewportSize } : { ...viewPortDefaults }
  const browser = await launch({ defaultViewport, headless: 'new' })
  try {
    const [page] = await browser.pages()
    await page.goto(options.url)
    await pageCallback(page)
  } catch (err) {
    console.error(err)
  } finally {
    await browser.close()
  }
}

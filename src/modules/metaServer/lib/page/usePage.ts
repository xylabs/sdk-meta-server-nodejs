import { launch, Page, Viewport } from 'puppeteer'

import { PageRenderingOptions } from './PageRenderingOptions'
import { defaultViewportSize } from './ViewPortSize'

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

export const usePage = async <T>(
  url: string,
  options: PageRenderingOptions | undefined = defaultPageRenderingOptions,
  pageCallback: (page: Page) => Promise<T> | T,
) => {
  if (!options) options = defaultPageRenderingOptions
  const defaultViewport: Viewport = options?.viewportSize ? { ...viewPortDefaults, ...options.viewportSize } : { ...viewPortDefaults }
  const browser = await launch({ defaultViewport, headless: 'new' })
  try {
    const [page] = await browser.pages()
    await page.goto(url)
    return await pageCallback(page)
  } catch (err) {
    console.error(err)
  } finally {
    await browser.close()
  }
}

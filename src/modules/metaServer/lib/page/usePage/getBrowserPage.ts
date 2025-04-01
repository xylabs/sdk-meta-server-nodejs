import type { Browser, Page } from 'puppeteer'

const useFirstTab = false

export type GetBrowserPage = (browser: Browser, origin: string) => Promise<Page>

export const getFirstTab: GetBrowserPage = async (browser: Browser, origin: string) => {
  let page = (await browser.pages())[0]
  console.log(`getFirstTab: [${page.url()}] [${origin}]`)
  if (page.url() !== origin) {
    page = await browser.newPage()
    await page.goto(origin)
  }
  return page
}

export const getNewPage: GetBrowserPage = async (browser: Browser, origin: string) => {
  const page = await browser.newPage()
  await page.goto(origin)
  return page
}

const pageGetter = useFirstTab ? getFirstTab : getNewPage

/**
 * For performance we'll hide the implementation of how we obtain a new
 * browser page. This allows us to switch between using the first tab
 * or new page without changing the calling code.
 * @returns A function to get a page from the browser
 */
export const getBrowserPage = (browser: Browser, origin: string) => pageGetter(browser, origin)

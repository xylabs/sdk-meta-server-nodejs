import { Browser, Page } from 'puppeteer'

const useFirstTab = false

export type GetBrowserPage = (browser: Browser) => Promise<Page>

const getFirstTab: GetBrowserPage = async (browser: Browser) => (await browser.pages())[0]
const getNewPage: GetBrowserPage = (browser: Browser) => browser.newPage()

const pageGetter = useFirstTab ? getFirstTab : getNewPage

/**
 * For performance we'll hide the implementation of how we obtain a new
 * browser page. This allows us to switch between using the first tab
 * or new page without changing the calling code.
 * @returns A function to get a page from the browser
 */
export const getBrowserPage = (browser: Browser) => pageGetter(browser)

import { Mutex, Semaphore } from 'async-mutex'
import type {
  Browser, Page, Viewport,
} from 'puppeteer'

import { defaultViewportSize, useBrowser } from '../../browser/index.ts'

const viewPortDefaults: Viewport = {
  ...defaultViewportSize,
  deviceScaleFactor: 1,
  hasTouch: false,
  isLandscape: false,
  isMobile: true, // So we can render as lean as possible
}

// Limit how many Puppeteer pages can be used concurrently
const PAGE_SEMAPHORE_WAIT_TIMEOUT = 10_000

export class PagePool {
  private _browser: Browser | undefined
  private readonly _browserMutex = new Mutex()
  private readonly _browserOptions: Viewport
  private _checkedOut: Set<number>
  private _maxTabs: number
  private _semaphore: Semaphore
  private _tabMutexes: Map<number, Mutex> = new Map()

  constructor(
    browserOptions: Viewport = viewPortDefaults,
    maxTabs: number = 3,
  ) {
    this._browserOptions = browserOptions
    this._maxTabs = maxTabs
    this._checkedOut = new Set()
    this._semaphore = new Semaphore(maxTabs)
  }

  private get browser(): Promise<Browser> {
    return this.ensureBrowser(this._browserOptions)
  }

  /**
   * Acquires a tab from the pool
   * @returns a Page and a release function to return it to the pool
   */
  async getPage(): Promise<{ page: Page; release: () => void }> {
    const [, releaseSemaphore] = await this._semaphore.acquire()

    // Find a free index
    const index = this.findAvailableIndex()
    this._checkedOut.add(index)

    const page = await this.getNthTab(index)

    const release = () => {
      this._checkedOut.delete(index)
      releaseSemaphore()
    }

    return { page, release }
  }

  private ensureBrowser = async (browserOptions: Viewport): Promise<Browser> => {
    return await this._browserMutex.runExclusive(async () => {
      if (!this._browser || !this._browser.connected) {
        try {
          await this._browser?.close()
        } catch (error) {
          console.error('useSpaPage: Error closing browser:', error)
        }
        this._browser = await useBrowser(browserOptions)
      }
      return this._browser
    })
  }

  private findAvailableIndex(): number {
    for (let i = 0; i < this._maxTabs; i++) {
      if (!this._checkedOut.has(i)) {
        return i
      }
    }
    // NOTE: This should never happen if semaphore works correctly
    console.error('No available tab index')
    throw new Error('No available tab index ')
  }

  private async getNthTab(index: number): Promise<Page> {
    let pages = await (await this.browser).pages()

    // If there are not enough tabs, create missing ones
    while (pages.length <= index) {
      await (await this.browser).newPage()
      pages = await (await this.browser).pages()
    }

    const page = pages[index]

    // Reset tab state
    await page.goto('about:blank')

    return page
  }
}

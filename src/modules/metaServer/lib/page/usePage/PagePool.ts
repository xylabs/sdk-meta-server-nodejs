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
  private readonly _checkedOut: Set<number>
  private readonly _maxTabs: number
  private readonly _semaphore: Semaphore
  private readonly _tabMutexes: Map<number, Mutex>

  constructor(
    browserOptions: Viewport = viewPortDefaults,
    maxTabs: number = 3,
  ) {
    this._browserOptions = browserOptions
    this._maxTabs = maxTabs
    this._checkedOut = new Set()
    this._semaphore = new Semaphore(maxTabs)
    this._tabMutexes = this._tabMutexes = new Map(
      Array.from({ length: this._maxTabs }, (_, i) => [i, new Mutex()]),
    )
  }

  private get browser(): Promise<Browser> {
    return this.ensureBrowser()
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

  private ensureBrowser = async (): Promise<Browser> => {
    return await this._browserMutex.runExclusive(async () => {
      if (!this._browser || !this._browser.connected) {
        try {
          await this._browser?.close()
        } catch (error) {
          console.error('useSpaPage: Error closing browser:', error)
        }
        this._browser = await useBrowser(this._browserOptions)
        let pages = await this._browser.pages()
        // Create the desired number of tabs
        while (pages.length < this._maxTabs) {
          await this._browser.newPage()
          pages = await this._browser.pages()
        }
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
    // Create or retrieve a mutex for this index
    if (!this._tabMutexes.has(index)) {
      this._tabMutexes.set(index, new Mutex())
    }
    const mutex = this._tabMutexes.get(index)!
    return await mutex.runExclusive(async () => {
      const browser = await this.browser
      let pages = await browser.pages()
      const page = pages[index]

      // Navigate to about:blank to reset state
      await page.goto('about:blank')

      return page
    })
  }
}

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

export class PagePool {
  private _browser: Browser | undefined
  private readonly _browserMutex = new Mutex()
  private readonly _browserOptions: Viewport
  private readonly _checkedOut = new Set<number>()
  private readonly _maxTabs: number
  private readonly _semaphore: Semaphore
  private _tabIndex = 0
  private readonly _tabMutexes: Map<number, Mutex>

  constructor(
    maxTabs: number = 3,
    browserOptions: Viewport = viewPortDefaults,
  ) {
    this._browserOptions = browserOptions
    this._maxTabs = maxTabs
    this._semaphore = new Semaphore(this._maxTabs)
    this._tabMutexes = new Map(
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

    const index = this.getNextAvailableTabIndex()
    this._checkedOut.add(index)

    const mutex = this._tabMutexes.get(index)!
    await mutex.acquire()

    try {
      const page = await this.getNthTab(index)
      const release = () => {
        this._checkedOut.delete(index)
        mutex.release()
        releaseSemaphore()
      }

      return { page, release }
    } catch (err) {
      mutex.release()
      releaseSemaphore()
      this._checkedOut.delete(index)
      throw err
    }
  }

  private ensureBrowser = async (): Promise<Browser> => {
    return await this._browserMutex.runExclusive(async () => {
      if (!this._browser || !this._browser.isConnected?.()) {
        try {
          await this._browser?.close()
        } catch (error) {
          console.error('PagePool: Error closing browser:', error)
        }
        this._browser = await useBrowser(this._browserOptions)

        let pages = await this._browser.pages()
        while (pages.length < this._maxTabs) {
          console.log('PagePool: Adding new tab')
          await this._browser.newPage()
          pages = await this._browser.pages()
          console.log('PagePool: Length', pages.length)
        }
      }
      return this._browser
    })
  }

  private getNextAvailableTabIndex(): number {
    for (let i = 0; i < this._maxTabs; i++) {
      const candidate = (this._tabIndex + i) % this._maxTabs
      if (!this._checkedOut.has(candidate)) {
        this._tabIndex = (candidate + 1) % this._maxTabs
        return candidate
      }
    }
    throw new Error('No available tab index (semaphore should have prevented this)')
  }

  private async getNthTab(index: number): Promise<Page> {
    const browser = await this.browser
    const pages = await browser.pages()
    const page = pages[index]

    try {
      await page.goto('about:blank')
    } catch (err) {
      console.error(`PagePool: Error navigating tab ${index} to about:blank`, err)
      throw err
    }

    return page
  }
}

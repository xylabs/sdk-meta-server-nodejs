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

export class BrowserPool {
  private readonly _browserOptions: Viewport
  private readonly _browsers: Browser[] = []
  private readonly _checkedOut = new Set<number>()
  private readonly _maxConcurrency: number
  private readonly _mutexes: Mutex[] = []
  private _nextIndex = 0
  private readonly _primedPages: Page[] = []
  private readonly _semaphore: Semaphore

  constructor(
    maxConcurrency: number = 3,
    browserOptions: Viewport = viewPortDefaults,
  ) {
    this._browserOptions = browserOptions
    this._maxConcurrency = maxConcurrency
    this._semaphore = new Semaphore(this._maxConcurrency)
  }

  /**
   * Acquires a browser tab from a browser in the pool
   * @returns a Page and a release function to return it to the pool
   */
  async getPage(): Promise<{ page: Page; release: () => void }> {
    const [, releaseSemaphore] = await this._semaphore.acquire()

    const index = this.getNextAvailableBrowserIndex()
    this._checkedOut.add(index)

    // Ensure we have the browser and primed page
    if (!this._browsers[index]) {
      this._browsers[index] = await useBrowser(this._browserOptions)
      this._mutexes[index] = new Mutex()
      this._primedPages[index] = await this._browsers[index]!.newPage()
    }

    const mutex = this._mutexes[index]!
    await mutex.acquire()

    try {
      const page = this._primedPages[index]!
      await page.goto('about:blank') // Reset state if needed

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

  private getNextAvailableBrowserIndex(): number {
    for (let i = 0; i < this._maxConcurrency; i++) {
      const candidate = (this._nextIndex + i) % this._maxConcurrency
      if (!this._checkedOut.has(candidate)) {
        this._nextIndex = (candidate + 1) % this._maxConcurrency
        return candidate
      }
    }
    throw new Error('No available browser index (semaphore should have prevented this)')
  }
}

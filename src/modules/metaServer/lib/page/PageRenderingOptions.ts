import type { WaitForOptions } from 'puppeteer'

import type { ViewPortSize } from '../browser/index.ts'

export type PageRenderingOptions = WaitForOptions & {
  viewportSize?: ViewPortSize
}

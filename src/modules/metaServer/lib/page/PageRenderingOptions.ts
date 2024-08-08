import { WaitForOptions } from 'puppeteer'

import { ViewPortSize } from '../browser/index.ts'

export type PageRenderingOptions = WaitForOptions & {
  viewportSize?: ViewPortSize
}

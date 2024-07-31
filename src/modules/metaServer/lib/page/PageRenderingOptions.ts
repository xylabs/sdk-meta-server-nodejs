import { WaitForOptions } from 'puppeteer'

import { ViewPortSize } from '../browser/index.js'

export type PageRenderingOptions = WaitForOptions & {
  viewportSize?: ViewPortSize
}

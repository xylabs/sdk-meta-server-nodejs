import { WaitForOptions } from 'puppeteer'

import { ViewPortSize } from '../browser'

export type PageRenderingOptions = WaitForOptions & {
  viewportSize?: ViewPortSize
}

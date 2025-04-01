import type { Page } from 'puppeteer'
import { bench, describe } from 'vitest'

import { useSpaPage } from '../useSpaPage.ts'

describe('Benchmark useSpaPage', () => {
  const uri = 'https://beta.xyo.network/blog'
  const metaTag = 'meta[property="xyo:og:image"]'
  bench('navigate to lightweight SPA page', async () => {
    // await Promise.all(Array.from({ length: 3 }).map(() => {
    await Promise.all([
      'https://beta.xyo.network/blog',
      'https://beta.xyo.network/news',
      'https://beta.xyo.network/xns',
    ].map((uri) => {
      return useSpaPage(
        uri,
        async (page: Page) => {
          await page.waitForSelector(metaTag, { timeout: 20_000 })
          const imageUrl = await (await page.$(metaTag))?.evaluate(el => el.getAttribute('content'))
          console.log('Image URL:', imageUrl)
          expect(imageUrl).toBeDefined()
        },
      )
    }))
  }, {
    warmupIterations: 1,
    iterations: 2,
  })
})

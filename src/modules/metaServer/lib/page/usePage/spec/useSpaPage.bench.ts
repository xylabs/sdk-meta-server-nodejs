import type { Page } from 'puppeteer'
import { bench, describe } from 'vitest'

import { useSpaPage } from '../useSpaPage.ts'

describe('Benchmark useSpaPage', () => {
  const uri = 'https://beta.xyo.network/blog'
  const expectedTitle = 'XYO | Blog'
  const metaTag = 'meta[property="xyo:og:image"]'
  bench('navigate to lightweight SPA page', async () => {
    await Promise.all(Array.from({ length: 10 }).map(() => {
      return useSpaPage(
        uri,
        async (page: Page) => {
          await page.waitForSelector(metaTag, { timeout: 20_000 })
          const imageUrl = await (await page.$(metaTag))?.evaluate(el => el.getAttribute('content'))
          console.log('Image URL:', imageUrl)
          // const title = await page.title()
          // expect(title).toBe(expectedTitle)
        },
      )
    }))
  }, {
    warmupIterations: 1,
    iterations: 2,
  })
})

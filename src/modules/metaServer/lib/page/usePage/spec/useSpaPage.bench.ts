import type { Page } from 'puppeteer'
import { bench, describe } from 'vitest'

import { useSpaPage } from '../useSpaPage.ts'

describe('Benchmark useSpaPage', () => {
  const uri = 'https://beta.xyo.network/blog'
  const metaTag = 'meta[property="xyo:og:image"]'
  bench('navigate to lightweight SPA page', async () => {
    await Promise.all(Array.from({ length: 12 }).map(() => {
    // await Promise.all([
    //   'https://beta.xyo.network/blog',
    //   'https://beta.xyo.network/news',
    //   'https://beta.xyo.network/xns',
    // ].map((uri) => {
      return useSpaPage(
        uri,
        async (page: Page) => {
          await page.waitForFunction((selector) => {
            const el = document.querySelector(selector)
            return el && el.getAttribute('content') && el.getAttribute('content')!.trim() !== ''
          }, { timeout: 20_000 }, metaTag)
          const imageUrl = await (await page.$(metaTag))?.evaluate(el => el.getAttribute('content'))
          console.log('Image URL:', imageUrl)
          expect(imageUrl).toBeTruthy()
        },
      )
    }))
  }, {
    warmupIterations: 1,
    iterations: 4,
  })
})

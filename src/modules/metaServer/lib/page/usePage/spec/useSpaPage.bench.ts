import type { Page } from 'puppeteer'
import { bench, describe } from 'vitest'

import { useSpaPage } from '../useSpaPage.ts'

describe('Benchmark useSpaPage', () => {
  const uri = 'https://beta.xyo.network/blog'
  bench('navigate to lightweight SPA page', async () => {
    await useSpaPage(
      uri,
      async (page: Page) => {
        // Minimal page interaction for benchmarking
        const title = await page.title()
        if (!title) throw new Error('No title found')
        console.log('Page title:', title)
        return title
      },
    )
  }, {
    warmupIterations: 2,
    iterations: 10, // optional: specify how many times to run it
  })
})

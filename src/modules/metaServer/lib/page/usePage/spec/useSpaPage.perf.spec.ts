import { useSpaPage } from '../useSpaPage.js'

describe.skip('useSpaPage [perf]', () => {
  const uri = 'https://react.dev/learn'
  const expected = 'Quick Start'
  it('gets the page', async () => {
    await Promise.all(Array.from({ length: 200 }).map(async () => {
      const content = await useSpaPage(uri, async (page) => {
        return await page.content()
      })
      expect(content).toContain(expected)
    }))
  }, 60_000)
})

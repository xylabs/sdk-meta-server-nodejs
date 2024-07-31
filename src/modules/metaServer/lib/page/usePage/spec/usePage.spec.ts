import { usePage } from '../usePage.js'

describe('usePage', () => {
  const uri = 'https://xyo.network/brand'
  const expected = '<title>XYO: Brand Assets &amp; Logos</title>'
  describe('with navigateToRootFirst=false', () => {
    it('gets the page', async () => {
      const result = await usePage(uri, undefined, async (page) => {
        await page.waitForSelector('title', { timeout: 10_000 })
        return page.content()
      })
      expect(result).toContain(expected)
    }, 60_000)
  })
  describe('with navigateToRootFirst=true', () => {
    it('gets the page', async () => {
      const result = await usePage(uri, undefined, async (page) => {
        await page.waitForSelector('title', { timeout: 10_000 })
        return page.content()
      })
      expect(result).toContain(expected)
    }, 60_000)
  })
})

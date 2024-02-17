import { useSpaPage } from '../useSpaPage'

describe('useSpaPage', () => {
  const uri = 'https://xyo.network/brand'
  const expected = '<title>XYO: Brand Assets &amp; Logos</title>'
  describe('with navigateToRootFirst=false', () => {
    it('gets the page', async () => {
      const content = await useSpaPage(uri, async (page) => {
        await page.waitForSelector('title', { timeout: 10_000 })
        return page.content()
      })
      expect(content).toContain(expected)
    }, 60_000)
  })
  describe('with navigateToRootFirst=true', () => {
    it('gets the page', async () => {
      const content = await useSpaPage(uri, async (page) => {
        await page.waitForSelector('title', { timeout: 10_000 })
        return page.content()
      })
      expect(content).toContain(expected)
    }, 60_000)
  })
})

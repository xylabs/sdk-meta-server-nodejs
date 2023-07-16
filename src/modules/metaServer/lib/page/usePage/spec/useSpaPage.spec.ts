import { useSpaPage } from '../useSpaPage'

describe('useSpaPage', () => {
  const uri = 'https://xyo.network/brand'
  const expected = '<title>XYO: Brand Assets &amp; Logos</title>'
  describe('with navigateToRootFirst=false', () => {
    it('gets the page', async () => {
      const result = await useSpaPage(uri, async (page) => {
        return await page.content()
      })
      expect(result).toContain(expected)
    })
  })
  describe('with navigateToRootFirst=true', () => {
    it('gets the page', async () => {
      const result = await useSpaPage(uri, async (page) => {
        return await page.content()
      })
      expect(result).toContain(expected)
    })
  })
})

import { getRenderedPageHtml } from '../getRenderedPageHtml'

describe('getRenderedPageHtml', () => {
  const uri = 'https://xyo.network/brand'
  const expected = '<title>XYO: Brand Assets &amp; Logos</title>'
  describe('with navigateToRootFirst=false', () => {
    it('gets the page', async () => {
      const result = await getRenderedPageHtml(uri, false)
      expect(result).toContain(expected)
    })
  })
  describe('with navigateToRootFirst=true', () => {
    it('gets the page', async () => {
      const result = await getRenderedPageHtml(uri, true)
      expect(result).toContain(expected)
    })
  })
})

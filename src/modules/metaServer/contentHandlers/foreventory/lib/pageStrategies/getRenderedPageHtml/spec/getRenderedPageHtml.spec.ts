import { getRenderedPageHtml } from '../getRenderedPageHtml'

describe('getRenderedPageHtml', () => {
  const uri = 'https://xyo.network/brand'
  const expected = '<title>XYO: Brand Assets &amp; Logos</title>'
  it('gets the page', async () => {
    const result = await getRenderedPageHtml(uri)
    expect(result).toContain(expected)
  })
})

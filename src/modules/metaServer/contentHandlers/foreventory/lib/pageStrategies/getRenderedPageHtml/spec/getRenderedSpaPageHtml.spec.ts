import { getRenderedSpaPageHtml } from '../getRenderedSpaPageHtml'

describe('getRenderedSpaPageHtml', () => {
  const uri = 'https://xyo.network/brand'
  const expected = '<title>XYO: Brand Assets &amp; Logos</title>'
  it('gets the page', async () => {
    const result = await getRenderedSpaPageHtml(uri)
    expect(result).toContain(expected)
  })
})

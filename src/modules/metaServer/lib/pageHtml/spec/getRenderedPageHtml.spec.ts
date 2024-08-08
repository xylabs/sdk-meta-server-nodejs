import { getRenderedPageHtml } from '../getRenderedPageHtml.ts'

describe('getRenderedSpaPageHtml', () => {
  const uri = 'https://react.dev/learn'
  const expected = 'Quick Start'
  it('gets the page', async () => {
    const result = await getRenderedPageHtml(uri, 'test')
    expect(result).toContain(expected)
  })
})

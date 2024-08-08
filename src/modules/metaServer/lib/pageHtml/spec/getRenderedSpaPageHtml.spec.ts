import { getRenderedSpaPageHtml } from '../getRenderedSpaPageHtml.ts'

describe('getRenderedSpaPageHtml', () => {
  const uri = 'https://react.dev/learn'
  const expected = 'Quick Start'
  it('gets the page', async () => {
    const result = await getRenderedSpaPageHtml(uri, 'test')
    expect(result).toContain(expected)
  })
})

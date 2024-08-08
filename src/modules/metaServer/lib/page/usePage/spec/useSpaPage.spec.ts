import { useSpaPage } from '../useSpaPage.js'

describe('useSpaPage', () => {
  const uri = 'https://react.dev/learn'
  const expected = 'Quick Start'
  it('gets the page', async () => {
    const content = await useSpaPage(uri, async (page) => {
      return await page.content()
    })
    expect(content).toContain(expected)
  }, 60_000)
})

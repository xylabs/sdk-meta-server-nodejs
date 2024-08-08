import { usePage } from '../usePage.js'

const waitForElementToInclude = (selector: string, expectedValue: string) => {
  const element = document.querySelector(selector)
  return element && element.textContent?.includes(expectedValue)
}

describe('usePage', () => {
  const uri = 'https://react.dev/learn'
  const expected = 'Quick Start'
  it('gets the page', async () => {
    const result = await usePage(uri, undefined, async (page) => {
      await page.waitForFunction(waitForElementToInclude,
        {
          polling: 100,
          timeout: 30_000,
        },
        'title',
        expected)
      return page.content()
    })
    expect(result).toContain(expected)
  }, 60_000)
})

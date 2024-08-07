import { useSpaPage } from '../useSpaPage.js'

const waitForElementToInclude = (selector: string, expectedValue: string) => {
  const element = document.querySelector(selector)
  return element && element.textContent?.includes(expectedValue)
}

describe('useSpaPage [perf]', () => {
  const uri = 'https://react.dev/learn'
  const expected = 'Quick Start'
  describe('with navigateToRootFirst=true', () => {
    it('gets the page', async () => {
      for (let index = 0; index < 100; index++) {
        const content = await useSpaPage(uri, async (page) => {
          await page.waitForFunction(waitForElementToInclude,
            {
              // polling: 100,
              // timeout: 30_000,
            },
            'title',
            expected)
          return page.content()
        })
        expect(content).toContain(expected)
      }
    }, 60_000)
  })
})

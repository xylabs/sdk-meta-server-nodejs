import { useSpaPage } from '../useSpaPage.js'

const waitForElementToInclude = (selector: string, expectedValue: string) => {
  const element = document.querySelector(selector)
  return element && element.textContent?.includes(expectedValue)
}

describe('useSpaPage', () => {
  const uri = 'https://xyo.network/brand'
  const expected = 'XYO: Brand Assets'
  describe('with navigateToRootFirst=true', () => {
    it('gets the page', async () => {
      const content = await useSpaPage(uri, async (page) => {
        await page.waitForFunction(waitForElementToInclude,
          {
            polling: 100,
            timeout: 30_000,
          },
          'title',
          expected)
        return page.content()
      })
      expect(content).toContain(expected)
    }, 60_000)
  })
})

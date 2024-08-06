import { useSpaPage } from '../useSpaPage.js'

const waitForElementToInclude = (selector: string, expectedValue: string) => {
  const element = document.querySelector(selector)
  return element && element.textContent?.includes(expectedValue)
}

describe('useSpaPage', () => {
  const uri = 'https://xyo.network/brand'
  const expected = '<title>XYO: Brand Assets &amp; Logos</title>'
  describe('with navigateToRootFirst=false', () => {
    it('gets the page', async () => {
      const content = await useSpaPage(uri, async (page) => {
        await page.waitForFunction(() => {
          const element = document.querySelector('title')
          return element && element.textContent?.includes('XYO: Brand Assets')
        })
        return page.content()
      })
      expect(content).toContain(expected)
    }, 60_000)
  })
  describe('with navigateToRootFirst=true', () => {
    it('gets the page', async () => {
      const content = await useSpaPage(uri, async (page) => {
        await page.waitForFunction((selector, expectedValue) => {
          const element = document.querySelector(selector)
          return element && element.textContent?.includes(expectedValue)
        },
        {}, // Options object, like timeout
        'title',
        'XYO: Brand Assets')
        return page.content()
      })
      expect(content).toContain(expected)
    }, 60_000)
  })
})

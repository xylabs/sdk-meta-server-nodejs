import { Page } from 'puppeteer'

export const getRenderedHead = async (page: Page) => {
  // const renderedMeta = await page.$$('head>meta')
  const renderedHead = await page.$('head')
  const renderedMeta = await renderedHead?.$('meta')
  const renderedTitle = await renderedHead?.$('title')
  const renderedDescrption = await renderedHead?.$('description')

  return ''
}

import { Meta } from '@xyo-network/sdk-meta'
import { Page } from 'puppeteer'

export const getRenderedHead = async (page: Page) => {
  const renderedHeadElement = await page.$('head')
  return await renderedHeadElement?.evaluate((head) => head.innerHTML)
}

export const getSelectiveHeadElements = async (page: Page) => {
  const meta = await getRenderedMetaElements(page)
  const title = await getTitle(page)
  return [title, ...meta]
}

export const getRenderedMetaElements = async (page: Page) => {
  const renderedMetaElements = await page.$$('head>meta')
  return await Promise.all(renderedMetaElements?.map((e) => e?.evaluate((meta) => meta.outerHTML)))
}

export const getTitle = async (page: Page) => {
  const renderedHeadElement = await page.$('head')
  const renderedTitleElement = await renderedHeadElement?.$('title')
  const title = await renderedTitleElement?.evaluate((title) => title.outerHTML)
  return title
}

export const getRenderedMeta = async (page: Page): Promise<Meta> => {
  const ret: Meta = {}
  const renderedHeadElement = await page.$('head')
  const renderedTitleElement = await renderedHeadElement?.$('title')
  const renderedDescriptionElement = await renderedHeadElement?.$('meta[name="description"]')
  // Get more meta tags here (og, twitter, etc.)
  const title = await renderedTitleElement?.evaluate((title) => title.innerHTML)
  const description = await renderedDescriptionElement?.evaluate((description) => description.getAttribute('content') ?? undefined)
  ret.title = title
  ret.description = description
  return ret
}

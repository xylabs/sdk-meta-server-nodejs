import { Meta } from '@xyo-network/sdk-meta'
import { Page } from 'puppeteer'

export const getRenderedHead = async (page: Page) => {
  const renderedHeadElement = await page.$('head')
  const renderedMetaElement = await renderedHeadElement?.$('meta')
  const renderedMetaElements = await page.$$('head>meta')
  const renderedTitleElement = await renderedHeadElement?.$('title')
  const renderedDescriptionElement = await renderedHeadElement?.$('description')

  const head = await renderedHeadElement?.evaluate((head) => head.innerHTML)
  const headOut = await renderedHeadElement?.evaluate((head) => head.outerHTML)
  const meta = await renderedMetaElement?.evaluate((meta) => meta.outerHTML)
  const metas = await Promise.all(renderedMetaElements?.map((e) => e?.evaluate((meta) => meta.outerHTML)))
  const title = await renderedTitleElement?.evaluate((title) => title.innerHTML)
  const description = await renderedDescriptionElement?.evaluate((description) => description.innerHTML)
  return ''
}

export const getRenderedMeta = async (page: Page): Promise<Meta> => {
  const ret: Meta = {}
  const renderedHeadElement = await page.$('head')
  const renderedMetaElement = await renderedHeadElement?.$('meta')
  const renderedMetaElements = await page.$$('head>meta')
  const renderedTitleElement = await renderedHeadElement?.$('title')
  const renderedDescriptionElement = await renderedHeadElement?.$('meta[name="description"]')

  const head = await renderedHeadElement?.evaluate((head) => head.innerHTML)
  const headOut = await renderedHeadElement?.evaluate((head) => head.outerHTML)
  const meta = await renderedMetaElement?.evaluate((meta) => meta.outerHTML)
  const metas = await Promise.all(renderedMetaElements?.map((e) => e?.evaluate((meta) => meta.outerHTML)))
  const title = await renderedTitleElement?.evaluate((title) => title.innerHTML)
  const description = await renderedDescriptionElement?.evaluate((description) => description.getAttribute('content') ?? undefined)
  ret.title = title
  ret.description = description
  return ret
}

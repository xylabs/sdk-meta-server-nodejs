import { usePage } from '../../page/index.js'
import { getRenderedHead, getRenderedMeta, getRenderedMetaElements, getSelectiveHeadElements } from '../getRenderedHead.js'

const uris = ['https://www.youtube.com/watch?v=Kauv7MVPcsA']

describe.skip('getRenderedHead', () => {
  describe('getRenderedHead', () => {
    it.each(uris)('Returns element from page', async (uri) => {
      const head = await usePage(uri, undefined, page => getRenderedHead(page))
      expect(head).toBeString()
    })
  })

  describe('getRenderedMetaElements', () => {
    it.each(uris)('Returns elements from page', async (uri) => {
      const meta = await usePage(uri, undefined, page => getRenderedMetaElements(page))
      expect(meta).toBeArray()
    })
  })

  describe('getRenderedMeta', () => {
    it.each(uris)('Returns object from elements on page', async (uri) => {
      const head = await usePage(uri, undefined, page => getRenderedMeta(page))
      expect(head).toBeObject()
    })
  })
  describe('getSelectiveHeadElements', () => {
    it.each(uris)('Returns object from elements on page', async (uri) => {
      const elements = await usePage(uri, undefined, page => getSelectiveHeadElements(page))
      expect(elements).toBeArray()
    })
  })
})

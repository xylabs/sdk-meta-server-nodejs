import { usePage } from '../../page'
import { getRenderedHead, getRenderedMeta } from '../getRenderedHead'

const uris = ['https://www.youtube.com/watch?v=Kauv7MVPcsA']

describe('getRenderedHead', () => {
  it.each(uris)('Returns true for known file extensions', async (uri) => {
    const head = await usePage(uri, undefined, async (page) => {
      expect(await getRenderedHead(page)).toBe(true)
      return getRenderedHead(page)
    })
    expect(head).toBeString()
  })
})

describe('getRenderedMeta', () => {
  it.each(uris)('Returns true for known file extensions', async (uri) => {
    const head = await usePage(uri, undefined, async (page) => {
      expect(await getRenderedMeta(page)).toBe(true)
      return getRenderedMeta(page)
    })
    expect(head).toBeObject()
  })
})

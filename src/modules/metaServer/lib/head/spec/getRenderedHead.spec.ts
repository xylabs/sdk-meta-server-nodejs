import { usePage } from '../../page'
import { getRenderedHead } from '../getRenderedHead'

const uris = ['https://dataism.org']

describe('getRenderedHead', () => {
  it.each(uris)('Returns true for known file extensions', async (uri) => {
    const head = await usePage(uri, undefined, async (page) => {
      expect(await getRenderedHead(page)).toBe(true)
      return getRenderedHead(page)
    })
    expect(head).toBeString()
  })
})

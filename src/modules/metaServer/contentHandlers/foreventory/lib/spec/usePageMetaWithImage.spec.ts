import { mock } from 'jest-mock-extended'

import { ImageCache } from '../imageCache'
import { usePageMetaWithImage } from '../usePageMetaWithImage'

describe('usePageMetaWithImage', () => {
  describe('for Payload URLs sets standard meta fields', () => {
    const cases: string[] = [
      // Case A
      'https://insiders.foreventory.com/netflix/insights/27c9343b576c59c40410e98226b98749b859abfa664054cd2fb2e7699cdf9f23',
    ]
    it.each(cases)('sets fields based on the  %s', async (url) => {
      const imageCache = mock<ImageCache>()
      const newHtml = await usePageMetaWithImage(url, imageCache)
      expect(newHtml).toBeString()
    })
  })
})

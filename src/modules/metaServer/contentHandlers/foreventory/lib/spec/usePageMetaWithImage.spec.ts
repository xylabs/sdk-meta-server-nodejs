import { mock } from 'jest-mock-extended'

import { ImageCache } from '../imageCache'
import { usePageMetaWithImage } from '../usePageMetaWithImage'

describe('usePageMetaWithImage', () => {
  describe('for Payload URLs sets standard meta fields', () => {
    const cases: string[] = ['https://dataism.org']
    it.each(cases)('sets fields based on the  %s', async (url) => {
      const imageCache = mock<ImageCache>()
      const newHtml = await usePageMetaWithImage(url, imageCache)
      expect(newHtml).toBeString()
    })
  })
})

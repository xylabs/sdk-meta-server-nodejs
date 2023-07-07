import { usePageMetaWithImage } from '../usePageMetaWithImage'

describe('usePageMetaWithImage', () => {
  describe('for Payload URLs sets standard meta fields', () => {
    const cases: string[] = ['']
    it.each(cases)('sets fields based on the  %s', async (path) => {
      const newHtml = await usePageMetaWithImage(path)
      expect(newHtml).toBeString()
    })
  })
})

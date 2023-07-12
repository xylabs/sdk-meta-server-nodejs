import { mock } from 'jest-mock-extended'

import { ImageCache } from '../cache'
import { getImageUrl } from '../getImageUrl'
import { usePageMetaWithImage } from '../usePageMetaWithImage'

describe('usePageMetaWithImage', () => {
  describe('for Payload URLs sets standard meta fields', () => {
    it('Updates meta with the expected fields', async () => {
      const domain = 'https://insiders.foreventory.com'
      const hash = '27c9343b576c59c40410e98226b98749b859abfa664054cd2fb2e7699cdf9f23'
      const width = 1600
      const height = 900
      const url = `${domain}/netflix/insights/${hash}`
      const imageUrl = getImageUrl(`${url}/preview`, width, height)
      const imageCache = mock<ImageCache>()
      const newHtml = await usePageMetaWithImage(url, imageCache)
      expect(newHtml).toBeString()
      expect(newHtml).toContain(`<meta property="og:image" content="${imageUrl}">`)
      expect(newHtml).toContain(`<meta property="og:image:height" content="${height}">`)
      expect(newHtml).toContain(`<meta property="og:image:secure_url" content="${imageUrl}">`)
      expect(newHtml).toContain('<meta property="og:image:type" content="image/png">')
      expect(newHtml).toContain(`<meta property="og:image:url" content="${imageUrl}">`)
      expect(newHtml).toContain(`<meta property="og:image:width" content="${width}">`)
      expect(newHtml).toContain(`<meta property="twitter:image" content="${imageUrl}">`)
    })
  })
})

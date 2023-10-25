import { ForgetPromise } from '@xylabs/forget'
import { mock } from 'jest-mock-extended'

import { defaultViewportSize, FileRepository } from '../../../../../../lib'
import { getImageUrl } from '../../../image'
import { getRenderedPageHtmlAndPreviewImage } from '../getRenderedPageHtmlAndPreviewImage'

describe.skip('getRenderedPageHtmlAndPreviewImage', () => {
  beforeAll(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {
      // Stop expected logs from being generated during tests
    })
  })
  describe('for Payload URLs sets standard meta fields', () => {
    it('Updates meta with the expected fields', async () => {
      const domain = 'https://beta.foreventory.com'
      const hash = '27c9343b576c59c40410e98226b98749b859abfa664054cd2fb2e7699cdf9f23'
      const { width, height } = defaultViewportSize
      const url = `${domain}/netflix/insights/${hash}`
      const imageUrl = getImageUrl(`${url}/preview`, width, height)
      const imageCache = mock<FileRepository>()
      const newHtml = await getRenderedPageHtmlAndPreviewImage(url, imageCache)
      expect(newHtml).toBeString()
      expect(newHtml).toContain(`<meta property="og:image" content="${imageUrl}">`)
      expect(newHtml).toContain(`<meta property="og:image:height" content="${height}">`)
      expect(newHtml).toContain(`<meta property="og:image:secure_url" content="${imageUrl}">`)
      expect(newHtml).toContain('<meta property="og:image:type" content="image/png">')
      expect(newHtml).toContain(`<meta property="og:image:url" content="${imageUrl}">`)
      expect(newHtml).toContain(`<meta property="og:image:width" content="${width}">`)
      expect(newHtml).toContain('<meta property="twitter:card" content="summary_large_image">')
      expect(newHtml).toContain(`<meta property="twitter:image" content="${imageUrl}">`)
    }, 30000)
  })
  afterAll(async () => {
    await ForgetPromise.awaitInactive()
  })
})

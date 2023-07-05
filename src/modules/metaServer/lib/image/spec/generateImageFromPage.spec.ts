import { generateImageFromPage, PageImageOptions } from '../generateImageFromPage'

describe('generateImageFromPage', () => {
  it('generates image from page', async () => {
    const opts: PageImageOptions = {
      encoding: 'binary',
      path: './test.png',
      type: 'png',
      url: 'https://dataism.org',
    }
    const image = await generateImageFromPage(opts)
    expect(image).toBeDefined()
  })
})

import { renderAndGenerateImageFromPage } from '../generateImageFromPage.ts'

describe('generateImageFromPage', () => {
  it('generates image from page', async () => {
    const url = 'https://dataism.org'
    const image = await renderAndGenerateImageFromPage(url)
    expect(image).toBeDefined()
  })
})

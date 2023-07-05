import { generateImageFromPage } from '../generateImageFromPage'

describe('generateImageFromPage', () => {
  it('generates image from page', async () => {
    const image = await generateImageFromPage('https://dataism.org', 'binary', { height: 1080, width: 1080 }, './test.png')
    expect(image).toBeDefined()
  })
})

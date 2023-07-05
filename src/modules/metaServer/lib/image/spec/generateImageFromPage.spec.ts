import { generateImageFromPage } from '../generateImageFromPage'

describe('generateImageFromPage', () => {
  it('generates image from page', async () => {
    const image = await generateImageFromPage('https://xyo.network')
    expect(image).toBeDefined()
  })
})

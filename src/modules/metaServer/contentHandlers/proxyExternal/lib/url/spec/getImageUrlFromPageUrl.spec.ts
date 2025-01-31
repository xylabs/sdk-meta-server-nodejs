import { getImageUrlFromPageUrl } from '../getImageUrlFromPageUrl.ts'

describe('getImageUrl', () => {
  const cases: [width: number, height: number][] = [
    [1600, 900],
    [1200, 630],
    [600, 315],
  ]
  it.each(cases)('generates image URL', (width, height) => {
    const url = 'https://www.google.com'
    const imageUrl = getImageUrlFromPageUrl(url, width, height)
    expect(imageUrl).toEqual(`https://www.google.com/preview/${width}/${height}/img.png`)
  })
})

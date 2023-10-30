import { getImageUrl } from '../getImageUrl'

describe('getImageUrl', () => {
  const cases: [width: number, height: number][] = [
    [1600, 900],
    [1200, 630],
    [600, 315],
  ]
  it.each(cases)('generates image URL', (width, height) => {
    const url = 'https://www.google.com'
    const imageUrl = getImageUrl(url, width, height)
    expect(imageUrl).toEqual(`https://www.google.com/${width}/${height}/img.png`)
  })
})

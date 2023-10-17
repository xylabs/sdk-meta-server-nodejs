import { getImageUrl } from '../getImageUrl'

describe('getImageUrl', () => {
  it('generates image URL', () => {
    const url = 'https://www.google.com'
    const imageUrl = getImageUrl(url, 1600, 900)
    expect(imageUrl).toEqual('https://www.google.com/1600/900/img.png')
  })
})

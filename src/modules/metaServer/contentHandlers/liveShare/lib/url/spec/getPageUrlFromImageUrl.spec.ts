import { getPageUrlFromImageUrl } from '../getPageUrlFromImageUrl'

describe('getPageUrlFromImageUrl', () => {
  const cases: [input: string, expected: string][] = [
    [
      'http://localhost:3000/netflix/insights/27c9343b576c59c40410e98226b98749b859abfa664054cd2fb2e7699cdf9f23/preview/1600/900/img.png',
      'http://localhost:3000/netflix/insights/27c9343b576c59c40410e98226b98749b859abfa664054cd2fb2e7699cdf9f23',
    ],
    [
      'https://beta.foreventory.com/netflix/insights/1f440d46ac56a44083a181728b78c004ba8063ea027860f8edf125a1d4c2a8a3/preview/1600/900/img.png',
      'https://beta.foreventory.com/netflix/insights/1f440d46ac56a44083a181728b78c004ba8063ea027860f8edf125a1d4c2a8a3',
    ],
  ]
  it.each(cases)('gets page url from image url', (input, expected) => {
    expect(getPageUrlFromImageUrl(input)).toBe(expected)
  })
})

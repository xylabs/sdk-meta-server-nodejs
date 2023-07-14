import { getPageUrlFromImageUrl } from '../getPageUrlFromImageUrl'

describe('getPageUrlFromImageUrl', () => {
  const cases: [input: string, expected: string][] = [['', '']]
  it.each(cases)('gets page url from image url', (input, expected) => {
    expect(getPageUrlFromImageUrl(input)).toBe(expected)
  })
})

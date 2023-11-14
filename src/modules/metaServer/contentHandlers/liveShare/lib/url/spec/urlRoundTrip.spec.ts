import { getImageUrlFromPageUrl } from '../getImageUrlFromPageUrl'
import { getPageUrlFromImageUrl } from '../getPageUrlFromImageUrl'

describe('url helpers', () => {
  const cases: [pageUrl: string][] = [
    ['http://localhost:3000/netflix/insights/27c9343b576c59c40410e98226b98749b859abfa664054cd2fb2e7699cdf9f23'],
    ['https://beta.foreventory.com/netflix/insights/1f440d46ac56a44083a181728b78c004ba8063ea027860f8edf125a1d4c2a8a3'],
    [
      'http://localhost:3000/web3/nfts/wallet/0xacdaEEb57ff6886fC8e203B9Dd4C2b241DF89b7a/score/91e65f4549ef72f1c623f704a6e9d70464c3d806456a5ad4582303e43920c8e1?chainId=1',
    ],
  ]
  it.each(cases)('return original url when round tripped', (original) => {
    const actual = getPageUrlFromImageUrl(getImageUrlFromPageUrl(original, 1200, 600))
    expect(actual).toEqual(original)
  })
})

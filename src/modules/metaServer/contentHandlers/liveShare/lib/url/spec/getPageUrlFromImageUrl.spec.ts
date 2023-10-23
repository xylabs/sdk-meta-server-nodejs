import { getPageUrlFromImageUrl } from '../getPageUrlFromImageUrl'

describe('getPageUrlFromImageUrl', () => {
  const cases: [imageUrl: string, pageUrl: string][] = [
    [
      'http://localhost:3000/netflix/insights/27c9343b576c59c40410e98226b98749b859abfa664054cd2fb2e7699cdf9f23/preview/1600/900/img.png',
      'http://localhost:3000/netflix/insights/27c9343b576c59c40410e98226b98749b859abfa664054cd2fb2e7699cdf9f23',
    ],
    [
      'https://beta.foreventory.com/netflix/insights/1f440d46ac56a44083a181728b78c004ba8063ea027860f8edf125a1d4c2a8a3/preview/1080/1080/img.png',
      'https://beta.foreventory.com/netflix/insights/1f440d46ac56a44083a181728b78c004ba8063ea027860f8edf125a1d4c2a8a3',
    ],
    [
      'http://localhost:3000/web3/nfts/wallet/0xacdaEEb57ff6886fC8e203B9Dd4C2b241DF89b7a/score/91e65f4549ef72f1c623f704a6e9d70464c3d806456a5ad4582303e43920c8e1/preview/1200/630/img.png?chainId=1',
      'http://localhost:3000/web3/nfts/wallet/0xacdaEEb57ff6886fC8e203B9Dd4C2b241DF89b7a/score/91e65f4549ef72f1c623f704a6e9d70464c3d806456a5ad4582303e43920c8e1?chainId=1',
    ],
  ]
  it.each(cases)('gets page url from image url', (imageUrl, pageUrl) => {
    expect(getPageUrlFromImageUrl(imageUrl)).toBe(pageUrl)
  })
})

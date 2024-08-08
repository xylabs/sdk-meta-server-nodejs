import { getImageMeta } from '../getImageMeta.ts'

describe('getImageMeta', () => {
  const cases = [
    'http://xyo.network',
    'https://beta.foreventory.com/web3/nfts/wallet/0xacdaEEb57ff6886fC8e203B9Dd4C2b241DF89b7a/score/e1b5b2a04069019a2ed2eb14e983b1dfaff96769a98c84fb9502d89615e07398?chainId=1',
  ]
  it.each(cases)('generates page preview image Meta', (url) => {
    const actual = getImageMeta(url)
    expect(actual).toMatchSnapshot()
  })
})

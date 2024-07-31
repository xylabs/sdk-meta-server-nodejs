import { MatchImageSnapshotOptions, toMatchImageSnapshot } from 'jest-image-snapshot'

import { usePage } from '../../../page/index.js'
import { join } from '../../../uri/index.js'
import { summaryCardWithLargeImageFromPage } from '../summaryCardWithLargeImageFromPage.js'

const opts: MatchImageSnapshotOptions = {
  customDiffConfig: {
    threshold: 0.1,
  },
  failureThreshold: 0.05,
  failureThresholdType: 'percent',
}

describe('summaryCardWithLargeImageFromPage', () => {
  beforeAll(() => {
    expect.extend({ toMatchImageSnapshot })
  })
  it('generates image', async () => {
    const url = join('file://', __dirname, 'index.html')
    await usePage(url, undefined, async (page) => {
      const image = await summaryCardWithLargeImageFromPage(page)
      expect(image).toMatchImageSnapshot(opts)
    })
  })
})

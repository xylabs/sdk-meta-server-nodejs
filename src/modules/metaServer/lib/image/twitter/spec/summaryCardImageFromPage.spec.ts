import { MatchImageSnapshotOptions, toMatchImageSnapshot } from 'jest-image-snapshot'

import { usePage } from '../../../page/index.ts'
import { join } from '../../../uri/index.ts'
import { summaryCardImageFromPage } from '../summaryCardImageFromPage.ts'

const opts: MatchImageSnapshotOptions = {
  customDiffConfig: {
    threshold: 0.1,
  },
  failureThreshold: 0.05,
  failureThresholdType: 'percent',
}

describe('summaryCardImageFromPage', () => {
  beforeAll(() => {
    expect.extend({ toMatchImageSnapshot })
  })
  it('generates image', async () => {
    const url = join('file://', __dirname, 'index.html')
    await usePage(url, undefined, async (page) => {
      const image = await summaryCardImageFromPage(page)
      expect(image).toMatchImageSnapshot(opts)
    })
  })
})

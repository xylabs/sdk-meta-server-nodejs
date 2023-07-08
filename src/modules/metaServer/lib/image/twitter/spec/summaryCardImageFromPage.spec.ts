import { toMatchImageSnapshot } from 'jest-image-snapshot'
import { join } from 'path'

import { usePage } from '../../../page'
import { summaryCardImageFromPage } from '../summaryCardImageFromPage'

describe('summaryCardImageFromPage', () => {
  beforeAll(() => {
    expect.extend({ toMatchImageSnapshot })
  })
  it('sets fields based', async () => {
    const url = join('file://', __dirname, 'index.html')
    await usePage(url, undefined, async (page) => {
      const image = await summaryCardImageFromPage(page)
      expect(image).toMatchImageSnapshot()
    })
  })
})

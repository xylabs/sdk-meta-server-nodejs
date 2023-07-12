import { mock } from 'jest-mock-extended'

import { ImageCache } from '../cache'
import { getRenderedPageAsImage } from '../getRenderedPageAsImage'

describe.skip('getRenderedPageAsImage', () => {
  let average = 0
  let duration = 0
  beforeAll(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {
      // Stop expected logs from being generated during tests
    })
  })
  afterAll(() => {
    jest.clearAllMocks()
    console.error(`Duration: ${duration}ms`)
    console.error(`Average: ${average}ms`)
  })
  it('perf test', async () => {
    const imageCache = mock<ImageCache>()
    const url = 'https://www.google.com'
    const start = Date.now()
    const iterations = 10
    for (let i = 0; i < iterations; i++) {
      await getRenderedPageAsImage(url, imageCache)
    }
    duration = Date.now() - start
    average = duration / iterations
  }, 60000)
})

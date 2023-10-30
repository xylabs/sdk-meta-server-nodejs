import { MemoryFileRepository } from '../../../../../lib'
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
    const repository = new MemoryFileRepository()
    const previewUrl = 'https://www.google.com'
    const iterations = 10
    const start = Date.now()
    // NOTE: This is generally more work that we want to do in the body
    // of a perf test.  However, what we want here it to get a general
    // feel as to what the performance will be like when we are generating
    // under load.  This is a good approximation of that.
    for (let i = 0; i < iterations; i++) {
      // Generate test url
      const url = `https://www.google.com/preview/${i}`
      // Get and cache the page preview image
      getRenderedPageAsImage(url, previewUrl, repository)
      // Retrieve the cached page preview image task
      const file = await repository.findFile(url)
      expect(file).toBeDefined()
      // Wait for the page preview image to be generated
      await file?.data
    }
    duration = Date.now() - start
    average = duration / iterations
  }, 60000)
})

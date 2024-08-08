import { exists } from '../exists.ts'

describe('exists', () => {
  describe('when path exists returns true', () => {
    it('for directory', async () => {
      const result = await exists(__dirname)
      expect(result).toBe(true)
    })
    it('for file', async () => {
      const result = await exists(__filename)
      expect(result).toBe(true)
    })
  })
  describe('when path does not exist', () => {
    it('returns false', async () => {
      const result = await exists('/path/does/not/exist/foo.bar')
      expect(result).toBe(false)
    })
  })
})

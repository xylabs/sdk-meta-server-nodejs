import { isKnownFileExtension } from './isKnownFileExtension'

const pathsWithRealExtensions = ['index.html', 'bundle.js']

const pathsWithFakeExtensions = ['network.xyo.payload']

describe('isKnownFileExtension', () => {
  it.each(pathsWithRealExtensions)('Returns true for localhost strings', (uri) => {
    expect(isKnownFileExtension(uri)).toBe(true)
  })
  it.each(pathsWithFakeExtensions)('Returns false for non-localhost strings', (uri) => {
    expect(isKnownFileExtension(uri)).toBe(false)
  })
})

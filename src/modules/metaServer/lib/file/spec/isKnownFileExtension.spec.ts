import { isKnownFileExtension } from '../isKnownFileExtension.js'

const pathsWithRealExtensions = [
  'index.html',
  'index.HTML',
  'bundle.js',
  'image.jpg',
  'image.gif',
  'image.webp',
  'https://beta.explore.xyo.network/favicon.ico',
  '/K2FifZFYk-dHSE0UPPuwQ7CrD94i-NCKm-U48M1wqxnDirBPlw.woff2',
  'https://cdn.xy.company/img/brand/XYO/XYO_icon_white.svg',
]

const pathsWithFakeExtensions = [
  'network.xyo.payload',
  'network.xyo.schema',
  'network.xyo.location.result',
  'network.xyo.location.result',
  'foo.bar',
  'baz.qix',
  'https://beta.api.archivist.xyo.network/archive/temp/payload/hash/32d377bfe7ebe382598c54dd13f8af7510e0a1e2fd2e913311fdd58e517e5e2e/',
  'https://beta.explore.xyo.network/schema/network.xyo.domain',
]

describe('isKnownFileExtension', () => {
  it.each(pathsWithRealExtensions)('Returns true for known file extensions', (uri) => {
    expect(isKnownFileExtension(uri)).toBe(true)
  })
  it.each(pathsWithFakeExtensions)('Returns false for unrecognized file extensions', (uri) => {
    expect(isKnownFileExtension(uri)).toBe(false)
  })
})

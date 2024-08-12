import { getContentType } from '../getContentType.ts'

const pathsWithRealExtensions = [
  ['index.html', 'text/html'],
  ['index.HTML', 'text/html'],
  ['bundle.js', 'text/javascript'],
  ['image.jpg', 'image/jpeg'],
  ['image.gif', 'image/gif'],
  ['image.webp', 'image/webp'],
  ['https://beta.explore.xyo.network/favicon.ico', 'image/vnd.microsoft.icon'],
  ['/K2FifZFYk-dHSE0UPPuwQ7CrD94i-NCKm-U48M1wqxnDirBPlw.woff2', 'font/woff2'],
  ['https://cdn.xy.company/img/brand/XYO/XYO_icon_white.svg', 'image/svg+xml'],
  ['https://xyo-network.ghost.io/content/images/2024/07/Header--1-.jpg', 'image/jpeg'],
  ['https://xyo-network.ghost.io/content/images/2024/07/1-g53vd4ro7yuoxyh-a0zygw.png', 'image/png'],
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

describe('getContentType', () => {
  it.each(pathsWithRealExtensions)('Returns string for known file extensions', (uri, expected) => {
    const actual = getContentType(uri)
    expect(actual).toBeString()
    expect(actual).toEqual(expected)
  })
  it.each(pathsWithFakeExtensions)('Returns false for unrecognized file extensions', (uri) => {
    expect(getContentType(uri)).toBeFalse()
  })
})

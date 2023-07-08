import { Meta, OpenGraphMeta, TwitterMeta } from '@xyo-network/sdk-meta'
import { readFile } from 'fs/promises'
import { join } from 'path'

import { getPayloadInfoFromPath } from '../getPayloadInfoFromPath'
import { setHtmlMetaData } from '../setHtmlMetaData'

const title = 'New Title'
const testOgMeta: OpenGraphMeta = {
  image: {
    secure_url: 'https://www.fillmurray.com/200/300',
    url: 'https://www.fillmurray.com/200/300',
  },
  title,
  type: 'website',
  url: 'https://test.xyo.network',
}
const testTwitterMeta: TwitterMeta = {
  card: 'summary_large_image',
  image: { '': 'https://www.placecage.com/400/300' },
  title,
}
const testMeta: Meta = {
  description: 'New Description',
  og: testOgMeta,
  title,
  twitter: testTwitterMeta,
}

const expectedOgMeta: OpenGraphMeta = {
  image: {
    secure_url: 'https://explore.xyo.network/meta-image-explore-og.jpg',
    url: 'https://explore.xyo.network/meta-image-explore-og.jpg',
  },
  title: 'XYO 2.1 Explore',
  type: 'website',
}
const expectedTwitterMeta: TwitterMeta = {
  card: 'summary_large_image',
  image: { '': 'https://explore.xyo.network/meta-image-explore-twitter.jpg' },
  title: 'XYO 2.1 Explore',
}
const expectedMeta: Meta = {
  description: 'Explore the XYO 2.1 Blockchain',
  og: expectedOgMeta,
  twitter: expectedTwitterMeta,
}

const verifyHtmlContainsMeta = (html: string, path: string, meta = testMeta) => {
  expect(html).toContain(meta.title)
  expect(html).toContain(meta.description)
  expect(html).toContain((meta.og?.image as { url?: string })?.url)
  expect(html).toContain(meta.og?.title)
  expect(html).toContain(meta.og?.type)
  expect(html).toContain(path)
  expect(html).toContain(meta.twitter?.card)
  expect(html).toContain(meta.twitter?.title)
  expect(html).toContain(meta.twitter?.image?.[''])
}

describe('setHtmlMetaData', () => {
  let originalHtml: string
  beforeAll(async () => {
    const template = join(__dirname, 'template.html')
    originalHtml = await readFile(template, { encoding: 'utf-8' })
  })
  describe('for non-Payload URLs', () => {
    it('sets standard meta fields', async () => {
      const path = 'https://www.google.com'
      const info = getPayloadInfoFromPath(path)
      const newHtml = await setHtmlMetaData(info, originalHtml, testMeta)
      verifyHtmlContainsMeta(newHtml, path)
    })
  })
  describe('for Payload URLs sets standard meta fields', () => {
    const bwHash = '6d7351f818fd9342fc41072a7dcceb57bdff0fe55e2f8e4d28abac13a5320b15'
    const payloadHash = '9213d6b605aad8a4b1871fd5d4f9a23355ffb7334b290afae51ead9bda9fa6a3'
    const cases: [type: string, hash: string, path: string][] = [
      ['Bound Witness', bwHash, `https://beta.explore.xyo.network/payload/hash/${bwHash}?network=kerplunk`],
      ['Payload', payloadHash, `https://beta.explore.xyo.network/payload/hash/${payloadHash}?network=kerplunk`],
    ]
    it.only.each(cases)('sets fields based on the %s', async (type, hash, path) => {
      const info = getPayloadInfoFromPath(path)
      const newHtml = await setHtmlMetaData(info, originalHtml, expectedMeta)
      expect(newHtml).toMatchSnapshot()
    })
  })
})

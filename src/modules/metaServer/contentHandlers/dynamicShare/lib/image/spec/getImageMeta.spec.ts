import '@xylabs/vitest-extended'

import { assertEx } from '@xylabs/assert'
import type { Meta, OpenGraphStructured } from '@xylabs/sdk-meta'
import {
  describe, expect, it,
} from 'vitest'

import { useSpaPage } from '../../../../../lib/index.ts'
import { getImageMeta } from '../getImageMeta.ts'

describe('getImageMeta', () => {
  const cases = [
    'https://xyo.network/blog',
    'https://xyo.network/xyos',
  ]
  it.each(cases)('generates page preview image Meta', async (url) => {
    const actual = await useSpaPage(url, async (renderedPage) => {
      const imageMeta = await getImageMeta(url, renderedPage)
      return imageMeta
    })
    expectOgMeta(actual)
    expectTwitterMeta(actual)
  })
})

const expectOgMeta = (actual?: Meta | undefined) => {
  expect(actual?.og).toBeObject()
  expect(actual?.og?.image).toBeObject()
  const ogImage = assertEx(actual?.og?.image) as OpenGraphStructured
  expect(ogImage['']).toBeTruthy()
  expect(ogImage?.url).toBeTruthy()
  expect(ogImage?.secure_url).toBeTruthy()
  expect(ogImage?.type).toBeTruthy()
  expect(ogImage?.height).toBeInteger()
  expect(ogImage?.width).toBeInteger()
}

const expectTwitterMeta = (actual?: Meta | undefined) => {
  expect(actual?.twitter).toBeObject()
  expect(actual?.twitter?.card).toBeTruthy()
  expect(actual?.twitter?.image).toBeObject()
  expect(actual?.twitter?.image?.['']).toBeTruthy()
}

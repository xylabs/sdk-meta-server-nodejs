import { Meta, metaBuilder, OpenGraphMeta, TwitterMeta } from '@xyo-network/sdk-meta'
import { join } from 'path'
import { URL } from 'url'

import {
  summaryCardImageFromPage,
  summaryCardViewport,
  summaryCardWithLargeImageFromPage,
  summaryCardWithLargeImageViewport,
  usePage,
} from '../../../lib'
import { ImageCache } from './imageCache'

/**
 * If true, use the large, rectangular image card. If false, use the small,
 * square image card.
 */
const useLargeImage = true

const { height, width } = useLargeImage ? summaryCardWithLargeImageViewport : summaryCardViewport
const twitterCardGenerator = useLargeImage ? summaryCardWithLargeImageFromPage : summaryCardImageFromPage

const getImageUrl = (url: string): string => {
  const parsed = new URL(url)
  return join(parsed.pathname, `${width}`, `${height}`)
}

export const usePageMetaWithImage = async (url: string, imageCache: ImageCache): Promise<string | undefined> => {
  try {
    const updatedHtml = await usePage(url, undefined, async (page) => {
      const html = await page.content()
      const image = await twitterCardGenerator(page)
      const imageUrl = getImageUrl(url)
      imageCache.set(imageUrl, image)
      const og: OpenGraphMeta = { image: { '': imageUrl, height, secure_url: imageUrl, type: 'image/png', url: imageUrl, width } }
      const twitter: TwitterMeta = { image: { '': imageUrl } }
      const meta: Meta = { og, twitter }
      return metaBuilder(html, meta)
    })
    return updatedHtml
  } catch (error) {
    console.log(error)
  }
  return undefined
}

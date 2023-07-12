import { Meta, OpenGraphMeta, TwitterMeta } from '@xyo-network/sdk-meta'

import {
  summaryCardImageFromPage,
  summaryCardViewport,
  summaryCardWithLargeImageFromPage,
  summaryCardWithLargeImageViewport,
  usePage,
} from '../../../lib'
import { getImageUrl } from './getImageUrl'
import { ImageCache } from './imageCache'

/**
 * If true, use the large, rectangular image card. If false, use the small,
 * square image card.
 */
const useLargeImage = true

const { height, width } = useLargeImage ? summaryCardWithLargeImageViewport : summaryCardViewport
const twitterCardGenerator = useLargeImage ? summaryCardWithLargeImageFromPage : summaryCardImageFromPage

export const getRenderedPageAsImage = async (url: string, imageCache: ImageCache): Promise<Meta | undefined> => {
  try {
    console.log(`[foreventory][getRenderedPageAsImage][${url}]: generating image`)
    const meta = await usePage(url, undefined, async (page) => {
      const image = await twitterCardGenerator(page)
      console.log(`[foreventory][getRenderedPageAsImage][${url}]: generating image url`)
      const imageUrl = getImageUrl(url, width, height)
      console.log(`[foreventory][getRenderedPageAsImage][${url}]: caching image`)
      imageCache.set(imageUrl, image)
      console.log(`[foreventory][getRenderedPageAsImage][${url}]: generating image meta`)
      const og: OpenGraphMeta = { image: { '': imageUrl, height, secure_url: imageUrl, type: 'image/png', url: imageUrl, width } }
      const twitter: TwitterMeta = { image: { '': imageUrl } }
      const meta: Meta = { og, twitter }
      console.log(`[foreventory][getRenderedPageAsImage][${url}]: returning image meta`)
      return meta
    })
    return meta
  } catch (error) {
    console.log(error)
  }
  return undefined
}

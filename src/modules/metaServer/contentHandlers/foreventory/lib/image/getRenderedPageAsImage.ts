import { forget } from '@xylabs/forget'
import { Meta, OpenGraphMeta, TwitterMeta } from '@xyo-network/sdk-meta'

import {
  summaryCardImageFromPage,
  summaryCardViewport,
  summaryCardWithLargeImageFromPage,
  summaryCardWithLargeImageViewport,
  usePage,
} from '../../../../lib'
import { ImageCache } from '../cache'
import { getImageUrl } from './getImageUrl'

/**
 * If true, use the large, rectangular image card. If false, use the small,
 * square image card.
 */
const useLargeImage = true

const { height, width } = useLargeImage ? summaryCardWithLargeImageViewport : summaryCardViewport
const twitterCardGenerator = useLargeImage ? summaryCardWithLargeImageFromPage : summaryCardImageFromPage

export const getRenderedPageAsImage = (url: string, imageCache: ImageCache): Meta | undefined => {
  console.log(`[foreventory][getRenderedPageAsImage][${url}]: generating image url`)
  const imageUrl = getImageUrl(url, width, height)
  console.log(`[foreventory][getRenderedPageAsImage][${url}]: backgrounding image generation`)
  forget(
    usePage(url, undefined, async (page) => {
      try {
        console.log(`[foreventory][getRenderedPageAsImage][${url}]: generating image`)
        const image = twitterCardGenerator(page)
        await image
        console.log(`[foreventory][getRenderedPageAsImage][${url}]: caching image`)
        imageCache.set(imageUrl, image)
        console.log(`[foreventory][getRenderedPageAsImage][${url}]: cached image`)
      } catch (error) {
        console.log(`[foreventory][getRenderedPageAsImage][${url}]: error generating image`)
        console.log(error)
      }
    }),
  )
  console.log(`[foreventory][getRenderedPageAsImage][${url}]: generating image meta`)
  const og: OpenGraphMeta = { image: { '': imageUrl, height, secure_url: imageUrl, type: 'image/png', url: imageUrl, width } }
  const twitter: TwitterMeta = { card: 'summary_large_image', image: { '': imageUrl } }
  const meta: Meta = { og, twitter }
  console.log(`[foreventory][getRenderedPageAsImage][${url}]: returning image meta`)
  return meta
}

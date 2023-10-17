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

/**
 * If true, use the large, rectangular image card. If false, use the small,
 * square image card.
 */
const useLargeImage = true

const { height, width } = useLargeImage ? summaryCardWithLargeImageViewport : summaryCardViewport
const twitterCardGenerator = useLargeImage ? summaryCardWithLargeImageFromPage : summaryCardImageFromPage

export const getRenderedPageAsImage = (url: string, imageCache: ImageCache): Meta | undefined => {
  console.log(`[liveShare][getRenderedPageAsImage][${url}]: backgrounding image generation`)
  forget(
    usePage(url, undefined, async (page) => {
      try {
        console.log(`[liveShare][getRenderedPageAsImage][${url}]: backgrounding image generation: beginning`)
        const imageTask = twitterCardGenerator(page)
        console.log(`[liveShare][getRenderedPageAsImage][${url}]: backgrounding image generation: caching`)
        imageCache.set(url, imageTask)
        console.log(`[liveShare][getRenderedPageAsImage][${url}]: backgrounding image generation: awaiting generation`)
        await imageTask
        console.log(`[liveShare][getRenderedPageAsImage][${url}]: backgrounding image generation: complete`)
      } catch (error) {
        console.log(`[liveShare][getRenderedPageAsImage][${url}]: backgrounding image generation: error`)
        console.log(error)
        console.log(`[liveShare][getRenderedPageAsImage][${url}]: backgrounding image generation: removing cached`)
        imageCache.delete(url)
      }
    }),
  )
  console.log(`[liveShare][getRenderedPageAsImage][${url}]: generating image meta`)
  const og: OpenGraphMeta = { image: { '': url, height, secure_url: url, type: 'image/png', url: url, width } }
  const twitter: TwitterMeta = { card: 'summary_large_image', image: { '': url } }
  const meta: Meta = { og, twitter }
  console.log(`[liveShare][getRenderedPageAsImage][${url}]: returning image meta`)
  return meta
}

import { Meta, metaBuilder, OpenGraphMeta, TwitterMeta } from '@xyo-network/sdk-meta'

import {
  join,
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
  return join(url, `${width}`, `${height}`)
}

export const usePageMetaWithImage = async (url: string, imageCache: ImageCache): Promise<string | undefined> => {
  try {
    const previewUrl = join(url, 'preview')
    const [html, meta] = await Promise.all([getRenderedHtml(url), getRenderedPageAsImage(previewUrl, imageCache)])
    if (html && meta) return metaBuilder(html, meta)
  } catch (error) {
    console.log(error)
  }
  return undefined
}

const getRenderedHtml = async (url: string): Promise<string | undefined> => {
  try {
    console.log(`[foreventory][getRenderedHtml][${url}]: rendering`)
    const html = await usePage(url, undefined, async (page) => await page.content())
    console.log(`[foreventory][getRenderedHtml][${url}]: returning`)
    return html
  } catch (error) {
    console.log(error)
  }
  return undefined
}

const getRenderedPageAsImage = async (url: string, imageCache: ImageCache): Promise<Meta | undefined> => {
  try {
    console.log(`[foreventory][getRenderedPageAsImage][${url}]: generating image`)
    const meta = await usePage(url, undefined, async (page) => {
      const image = await twitterCardGenerator(page)
      console.log(`[foreventory][getRenderedPageAsImage][${url}]: generating image url`)
      const imageUrl = getImageUrl(url)
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

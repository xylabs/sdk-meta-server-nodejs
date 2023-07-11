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
    const previewUrl = join(url, 'preview')
    const [html, meta] = await Promise.all([await getRenderedHtml(url), await getRenderedPageAsImage(previewUrl, imageCache)])
    if (html && meta) return metaBuilder(html, meta)
  } catch (error) {
    console.log(error)
  }
  return undefined
}

const getRenderedHtml = async (url: string): Promise<string | undefined> => {
  try {
    return await usePage(url, undefined, async (page) => await page.content())
  } catch (error) {
    console.log(error)
  }
  return undefined
}

const getRenderedPageAsImage = async (url: string, imageCache: ImageCache): Promise<Meta | undefined> => {
  try {
    const meta = await usePage(url, undefined, async (page) => {
      const image = await twitterCardGenerator(page)
      const imageUrl = getImageUrl(url)
      imageCache.set(imageUrl, image)
      const og: OpenGraphMeta = { image: { '': imageUrl, height, secure_url: imageUrl, type: 'image/png', url: imageUrl, width } }
      const twitter: TwitterMeta = { image: { '': imageUrl } }
      const meta: Meta = { og, twitter }
      return meta
    })
    return meta
  } catch (error) {
    console.log(error)
  }
  return undefined
}

import { Meta, metaBuilder, OpenGraphMeta, TwitterMeta } from '@xyo-network/sdk-meta'
import { URL } from 'url'

import { summaryCardWithLargeImageFromPage, usePage } from '../../../lib'
import { ImageCache } from '../ImageCache'

const getImageUrl = (url: string): string => {
  const parsed = new URL(url)
  return `${parsed.origin}/${parsed.pathname}/share.png`
}

export const usePageMetaWithImage = async (url: string, imageCache: ImageCache): Promise<string | undefined> => {
  try {
    const updatedHtml = await usePage(url, undefined, async (page) => {
      const html = await page.content()
      const image = await summaryCardWithLargeImageFromPage(page)
      const imageUrl = getImageUrl(url)
      imageCache.set(imageUrl, image)
      const og: OpenGraphMeta = { image: { '': imageUrl, secure_url: imageUrl, type: 'image/png', url: imageUrl } }
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

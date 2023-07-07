import { Meta, metaBuilder } from '@xyo-network/sdk-meta'
import { URL } from 'url'

import { generateImageBufferFromPage, usePage } from '../../../lib'
import { ImageCache } from '../ImageCache'

const getImageUrl = (url: string): string => {
  const parsed = new URL(url)
  return `${parsed.origin}/${parsed.pathname}/share.png`
}

export const usePageMetaWithImage = async (url: string, imageCache: ImageCache): Promise<string | undefined> => {
  try {
    const updatedHtml = await usePage(url, undefined, async (page) => {
      const image = await generateImageBufferFromPage(page)
      const imageUrl = getImageUrl(url)
      imageCache.set(imageUrl, image)
      const html = await page.content()
      const meta: Meta = {
        og: {
          image: {
            type: 'image/png',
            url: imageUrl,
          },
        },
        twitter: {
          image: {
            url: imageUrl,
          },
        },
      }
      return metaBuilder(html, meta)
    })
    return updatedHtml
  } catch (error) {
    console.log(error)
  }
  return undefined
}

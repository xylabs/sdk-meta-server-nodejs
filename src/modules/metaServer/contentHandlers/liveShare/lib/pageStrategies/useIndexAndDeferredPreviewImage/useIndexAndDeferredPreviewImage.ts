import { assertEx } from '@xylabs/assert'
import { metaBuilder } from '@xyo-network/sdk-meta'

import { useSpaPage } from '../../../../../lib'
import { ImageCache } from '../../cache'
import { getPagePreviewImageMeta, getRenderedPageAsImage } from '../../image'

/**
 * The property name of the meta element
 * which contains the preview image URL
 */
const xyoOgImageProperty = 'xyo:og:image'

export const useIndexAndDeferredPreviewImage = async (url: string, imageCache: ImageCache, indexHtml: string): Promise<string> => {
  try {
    console.log(`[liveShare][useIndexAndDeferredPreviewImage][${url}]: rendering in background`)
    // TODO: Optimize this with something like React SSR
    // Parse head for xyo:og:image data URL
    const metaImageElement = assertEx(
      await useSpaPage(url, async (page) => {
        console.log(`[liveShare][getRenderedPageHtml][${url}]: navigated to ${url}`)
        return await page.evaluate(() => {
          // Find the first meta element with the specified property
          const meta = document.head.querySelector(`meta[property="${xyoOgImageProperty}"]`)
          // Extract the meta element's attributes
          if (meta) {
            const content = meta.getAttribute('content')
            if (content) {
              return { content, property: xyoOgImageProperty }
            }
          }
          return undefined
        })
      }),
      `[liveShare][useIndexAndDeferredPreviewImage][${url}]: error, missing meta element with ${xyoOgImageProperty} property`,
    )
    const previewUrl = metaImageElement.content
    getRenderedPageAsImage(previewUrl, imageCache)
    const meta = getPagePreviewImageMeta(url)
    const updatedHtml = metaBuilder(indexHtml, meta)
    console.log(`[liveShare][useIndexAndDeferredPreviewImage][${url}]: returning index.html & preview image meta`)
    return updatedHtml
  } catch (error) {
    console.log(error)
  }
  console.log(`[liveShare][useIndexAndDeferredPreviewImage][${url}]: error, returning index.html`)
  return indexHtml
}

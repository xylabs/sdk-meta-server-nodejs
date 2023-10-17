import { metaBuilder } from '@xyo-network/sdk-meta'

import { ImageCache } from '../../cache'
import { getPagePreviewImageMeta, getRenderedPageAsImage } from '../../image'
import { getPreviewUrl } from '../../url'

export const useIndexAndDeferredPreviewImage = (url: string, imageCache: ImageCache, indexHtml: string): string => {
  try {
    console.log(`[liveShare][useIndexAndDeferredPreviewImage][${url}]: rendering in background`)
    getRenderedPageAsImage(getPreviewUrl(url), imageCache)
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

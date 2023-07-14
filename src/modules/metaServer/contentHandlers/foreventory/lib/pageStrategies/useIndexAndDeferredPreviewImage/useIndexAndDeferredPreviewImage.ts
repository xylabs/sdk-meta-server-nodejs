import { forget } from '@xylabs/forget'
import { metaBuilder } from '@xyo-network/sdk-meta'

import { join } from '../../../../../lib'
import { ImageCache } from '../../cache'
import { getPagePreviewImageMeta, getRenderedPageAsImage } from '../../image'

export const useIndexAndDeferredPreviewImage = (url: string, imageCache: ImageCache, indexHtml: string): string | undefined => {
  try {
    console.log(`[foreventory][useIndexAndDeferredPreviewImage][${url}]: rendering in background`)
    forget(getRenderedPageAsImage(join(url, 'preview'), imageCache))
    const meta = getPagePreviewImageMeta(url)
    const updatedHtml = metaBuilder(indexHtml, meta)
    console.log(`[foreventory][useIndexAndDeferredPreviewImage][${url}]: returning index.html & preview image meta`)
    return updatedHtml
  } catch (error) {
    console.log(error)
  }
  console.log(`[foreventory][useIndexAndDeferredPreviewImage][${url}]: missing html or preview image`)
  return undefined
}

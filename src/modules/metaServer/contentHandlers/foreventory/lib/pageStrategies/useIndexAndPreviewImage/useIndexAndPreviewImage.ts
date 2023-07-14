import { metaBuilder } from '@xyo-network/sdk-meta'

import { join } from '../../../../../lib'
import { ImageCache } from '../../cache'
import { getRenderedPageAsImage } from '../../image'

export const useIndexAndPreviewImage = async (url: string, imageCache: ImageCache, indexHtml: string): Promise<string> => {
  try {
    console.log(`[foreventory][useIndexAndPreviewImage][${url}]: rendering`)
    const previewUrl = join(url, 'preview')
    const meta = await getRenderedPageAsImage(previewUrl, imageCache)
    if (meta) {
      console.log(`[foreventory][useIndexAndPreviewImage][${url}]: rendered html & preview image`)
      return metaBuilder(indexHtml, meta)
    }
  } catch (error) {
    console.log(error)
  }
  console.log(`[foreventory][useIndexAndPreviewImage][${url}]: error, returning index.html`)
  return indexHtml
}

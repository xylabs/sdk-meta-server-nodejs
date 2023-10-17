import { metaBuilder } from '@xyo-network/sdk-meta'

import { ImageCache } from '../../cache'
import { getRenderedPageAsImage } from '../../image'
import { getPreviewUrl } from '../../url'

export const useIndexAndPreviewImage = async (url: string, imageCache: ImageCache, indexHtml: string): Promise<string> => {
  try {
    console.log(`[liveShare][useIndexAndPreviewImage][${url}]: rendering`)
    const previewUrl = getPreviewUrl(url)
    const meta = await getRenderedPageAsImage(previewUrl, imageCache)
    if (meta) {
      console.log(`[liveShare][useIndexAndPreviewImage][${url}]: rendered html & preview image`)
      return metaBuilder(indexHtml, meta)
    }
  } catch (error) {
    console.log(error)
  }
  console.log(`[liveShare][useIndexAndPreviewImage][${url}]: error, returning index.html`)
  return indexHtml
}

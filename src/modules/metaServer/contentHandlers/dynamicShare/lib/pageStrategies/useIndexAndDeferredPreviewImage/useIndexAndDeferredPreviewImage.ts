import { metaBuilder } from '@xyo-network/sdk-meta'

import { getImageMeta } from '../../image/index.js'

export const useIndexAndDeferredPreviewImage = (url: string, indexHtml: string): string => {
  try {
    console.log(`[liveShare][useIndexAndDeferredPreviewImage][${url}]: generating preview image meta`)
    const meta = getImageMeta(url)
    const updatedHtml = metaBuilder(indexHtml, meta)
    console.log(`[liveShare][useIndexAndDeferredPreviewImage][${url}]: returning index.html & preview image meta`)
    return updatedHtml
  } catch (error) {
    console.log(error)
  }
  console.log(`[liveShare][useIndexAndDeferredPreviewImage][${url}]: error, returning index.html`)
  return indexHtml
}
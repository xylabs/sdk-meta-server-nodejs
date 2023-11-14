import { metaBuilder } from '@xyo-network/sdk-meta'

import { FileRepository } from '../../../../../lib'
import { getLiveShareImageMeta, getRenderedPageAsImage } from '../../image'

export const useIndexAndDeferredPreviewImage = (url: string, imageRepository: FileRepository, indexHtml: string): string => {
  try {
    console.log(`[liveShare][useIndexAndDeferredPreviewImage][${url}]: generating preview image meta`)
    const meta = getLiveShareImageMeta(url)
    // Initiate the image generation but don't await it
    getRenderedPageAsImage(url, imageRepository)
    const updatedHtml = metaBuilder(indexHtml, meta)
    console.log(`[liveShare][useIndexAndDeferredPreviewImage][${url}]: returning index.html & preview image meta`)
    return updatedHtml
  } catch (error) {
    console.log(error)
  }
  console.log(`[liveShare][useIndexAndDeferredPreviewImage][${url}]: error, returning index.html`)
  return indexHtml
}

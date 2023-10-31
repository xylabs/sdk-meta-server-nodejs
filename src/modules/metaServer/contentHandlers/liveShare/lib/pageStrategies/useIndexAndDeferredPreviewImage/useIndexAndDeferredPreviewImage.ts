import { metaBuilder } from '@xyo-network/sdk-meta'

import { FileRepository } from '../../../../../lib'
import { getLiveSharePreviewUrlFromHtmlMeta, getPagePreviewImageMeta, getRenderedPageAsImage } from '../../image'

export const useIndexAndDeferredPreviewImage = async (url: string, imageRepository: FileRepository, indexHtml: string): Promise<string> => {
  try {
    console.log(`[liveShare][useIndexAndDeferredPreviewImage][${url}]: getting preview URL from page`)

    // Extract the preview image URL from the meta element & decode it
    const previewUrl = await getLiveSharePreviewUrlFromHtmlMeta(url)

    // Check if we've already got a preview for this URL
    const existingImage = await imageRepository.findFile(url)
    if (existingImage?.data) {
      console.log(`[liveShare][useIndexAndDeferredPreviewImage][${url}]: image already exists, skipping rendering`)
    } else {
      console.log(`[liveShare][useIndexAndDeferredPreviewImage][${url}]: rendering in background`)
      // Initiate the image generation but don't await it
      getRenderedPageAsImage(url, previewUrl, imageRepository)
    }

    console.log(`[liveShare][useIndexAndDeferredPreviewImage][${url}]: generating preview image meta`)
    const meta = getPagePreviewImageMeta(url)

    // TODO: Use page meta since we already took the hit to render
    const updatedHtml = metaBuilder(indexHtml, meta)
    console.log(`[liveShare][useIndexAndDeferredPreviewImage][${url}]: returning index.html & preview image meta`)

    return updatedHtml
  } catch (error) {
    console.log(error)
  }
  console.log(`[liveShare][useIndexAndDeferredPreviewImage][${url}]: error, returning index.html`)
  return indexHtml
}

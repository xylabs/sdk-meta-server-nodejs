import { ImageCache } from '../../../../../lib'
import { getLiveSharePreviewUrlFromHtmlMeta, getRenderedPageAsImage } from '../../image'

export const getPagePreviewImage = async (url: string, imageCache: ImageCache): Promise<void> => {
  console.log(`[liveShare][getPagePreviewImage][${url}]: getting preview URL from page`)
  // Extract the preview image URL from the meta element & decode it
  const previewUrl = await getLiveSharePreviewUrlFromHtmlMeta(url)
  console.log(`[liveShare][getPagePreviewImage][${url}]: rendering in background`)
  // Initiate the image generation but don't await it
  getRenderedPageAsImage(previewUrl, imageCache)
}

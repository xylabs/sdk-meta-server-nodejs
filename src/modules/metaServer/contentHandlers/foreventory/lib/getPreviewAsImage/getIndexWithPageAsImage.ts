import { join } from '../../../../lib'
import { ImageCache } from '../cache'
import { getRenderedPageAsImage } from '../getRenderedPageAsImage'

export const getPagePreviewImage = async (uri: string, imageCache: ImageCache): Promise<void> => {
  console.log(`[foreventory][getPagePreviewImage][${uri}]: rendering`)
  const previewUrl = join(uri, 'preview')
  await getRenderedPageAsImage(previewUrl, imageCache)
  console.log(`[foreventory][getPagePreviewImage][${uri}]: rendered`)
}
